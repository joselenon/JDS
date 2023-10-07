// Jackpot system
import * as admin from 'firebase-admin';

import { IBetRedisCreate } from '../../config/interfaces/IBet';
import {
  IGameDBUpdate,
  IGameDB,
  IGameInfoUpdate,
  IGameInfo,
} from '../../config/interfaces/IGame';

import { NoJackpotError } from '../../config/errors/classes/SystemErrors';
import getRedisKeyHelper from '../../helpers/redisHelper';
import pSubEventHelper from '../../helpers/pSubEventHelper';
import ProcessWinnerService from './ProcessWinnerService';
import BalanceService from '../BalanceService';
import { JackpotBetsService } from './BetsService';
import { FirebaseInstance, RedisInstance } from '../..';

const lastJackpotsCacheKey = getRedisKeyHelper('last_jackpots');
export const jackpotBetsQueueCacheKey = getRedisKeyHelper('jackpot_bets_queue');
const jackpotDuration = 15 * 1000;
const jackpotAnimationDuration = 10 * 1000;

class JackpotService {
  private static jackpot: IGameInfo | undefined;

  // Durations measured per ms
  private static shouldListenBets: boolean = true;

  static getShouldListenBets() {
    return JackpotService.shouldListenBets;
  }

  // Check all functions that uses this
  static emitPSub(jackpotRedisPayload: any) {
    pSubEventHelper('GET_REDIS_JACKPOT', 'getLiveJackpot', {
      success: true,
      message: 'GET_MSG',
      data: {
        ...jackpotRedisPayload,
        jackpotDuration,
        jackpotAnimationDuration,
      },
    });
  }

  // Helper function to update every DB, Cache and Client jackpots info
  static async updateJackpots(
    jackpotInRedis: IGameInfo,
    payload: IGameInfoUpdate,
  ) {
    const { docId: jackpotDocId } = jackpotInRedis;

    const keysToRemove = ['winningBetRef', 'bets'];

    // Jackpot Update
    const payloadToDB: IGameDBUpdate = Object.entries(payload) // OPTIMIZE
      .filter(([key]) => !keysToRemove.includes(key))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // checkthis ------------------------------------------------------------------
    if (Array.isArray(payload.bets) && !payload.winningBetRef) {
      const { docId } = payload.bets[0];
      const betRef = await FirebaseInstance.getDocumentRef('bets', docId);
      payloadToDB.bets = admin.firestore.FieldValue.arrayUnion(betRef);
    }
    if (payload.winningBetRef) {
      const { docId } = payload.winningBetRef;
      const winningBetRef = await FirebaseInstance.getDocumentRef(
        'bets',
        docId,
      );
      payloadToDB.winningBetRef = winningBetRef;
    }
    await FirebaseInstance.updateDocument('games', jackpotDocId, payloadToDB);

    // Redis Update
    const jackpotRedisPayload = {
      ...jackpotInRedis,
      ...payload,
      jackpotDuration,
      jackpotAnimationDuration,
    };
    if (payload.bets) {
      jackpotRedisPayload.bets = [...jackpotInRedis.bets, ...payload.bets];
    }

    JackpotService.jackpot = jackpotRedisPayload;
    JackpotService.emitPSub(jackpotRedisPayload);

    // Potential errors: UnexpectedDatabaseError || RedisError
  }

  // Get jackpot info from Cache
  static getJackpotInRedis(): IGameInfo | undefined {
    return JackpotService.jackpot;
  }

  // Creates a new jackpot on DB and Cache and send to Client
  async createNewJackpot(): Promise<IGameInfo> {
    const jackpotDBPayload: IGameDB = {
      bets: [],
      createdAt: Date.now(),
      prizePool: 0,
      status: 'ACTIVE',
      type: 'JACKPOT',
    };
    const jackpotDocId = await FirebaseInstance.writeDocument(
      'games',
      jackpotDBPayload,
    );
    const jackpotInfo = {
      ...jackpotDBPayload,
      docId: jackpotDocId,
      winningBetRef: undefined,
      jackpotDuration,
      jackpotAnimationDuration,
    };
    JackpotService.emitPSub(jackpotInfo);
    return jackpotInfo;
  }

  async getLastJackpotsInRedis(): Promise<IGameInfo[]> {
    const lastJackpotsInRedis = await RedisInstance.lRange<IGameInfo>(
      lastJackpotsCacheKey,
      { inJSON: true },
    );
    return lastJackpotsInRedis && lastJackpotsInRedis.length > 0
      ? lastJackpotsInRedis
      : [];
  }

  // Checks if jackpot on Cache is updated, if not, it updates
  async checkAndSetJackpot(): Promise<IGameInfo> {
    let jackpot = JackpotService.jackpot;

    if (
      !jackpot ||
      jackpot.status === 'FINISHED' ||
      jackpot.status === 'CANCELLED'
    ) {
      jackpot = await this.createNewJackpot();
    }

    return (JackpotService.jackpot = jackpot);
    // Potential errors: UnexpectedDatabaseError
  }

  // Creates the loop responsible for execute queues
  //  - should be allowed to run only with JackpotService.jackpot. Throws error in case it's undefined
  async processJackpotBetsQueue() {
    while (JackpotService.shouldListenBets) {
      const jackpot = JackpotService.jackpot;
      if (!jackpot) throw new NoJackpotError();

      const task = await RedisInstance.lPop<IBetRedisCreate>(
        jackpotBetsQueueCacheKey,
        1,
        { inJSON: true },
      );

      if (!task) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }

      const BetService = new JackpotBetsService(task, jackpot);
      await BetService.makeBet();
      // Potential errors: NoJackpotError || UnexpectedDatabaseError || RedisError
    }
  }

  // Process bets done before jackpot finishing
  async receiveLastBets() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const jackpot = JackpotService.jackpot;
      const task = await RedisInstance.lPop<IBetRedisCreate>(
        jackpotBetsQueueCacheKey,
        1,
        { inJSON: true },
      );

      if (!task) break;
      if (!jackpot) throw new NoJackpotError();

      const BetService = new JackpotBetsService(task, jackpot);
      await BetService.makeBet();
    }
    await JackpotBetsService.clearBetsQueue();
  }

  async waitForJackpotToStart(): Promise<number> {
    return new Promise((resolve) => {
      // Change to dynamic Database watcher
      const toStartInterval = setInterval(async () => {
        const jackpot = JackpotService.jackpot;

        if (!jackpot) throw new NoJackpotError();

        if (jackpot.startedAt) {
          clearInterval(toStartInterval);
          resolve(jackpot.startedAt);
        }
      }, 100);
    });
  }

  async waitForJackpotToFinish(jackpotStartedAt: number): Promise<void> {
    return new Promise((resolve) => {
      const toFinishInterval = setInterval(async () => {
        const timeNow = new Date().getTime();
        const timeSinceJackpotStarted = timeNow - jackpotStartedAt;

        if (timeSinceJackpotStarted > jackpotDuration) {
          clearInterval(toFinishInterval);
          resolve();
        }
      }, 100);
    });
  }

  async saveAndUpdateGameHistory() {
    const jackpot = JackpotService.jackpot;
    if (!jackpot) throw new NoJackpotError();

    const redisLastJackpots = await this.getLastJackpotsInRedis();

    if (redisLastJackpots.length === 10) {
      await RedisInstance.rPop(lastJackpotsCacheKey, 1, { inJSON: true });
    }

    await RedisInstance.lPush(lastJackpotsCacheKey, jackpot, {
      inJSON: true,
    });

    const redisLastJackpotsAtt = await this.getLastJackpotsInRedis();
    return pSubEventHelper('GET_LIVE_LAST_JACKPOTS', 'getLiveLastJackpots', {
      success: true,
      message: 'GET_MSG',
      data: redisLastJackpotsAtt,
    });

    // Potential errors: RedisError
  }

  // Close jackpot, draw the winner and then finishes it
  async finishJackpot() {
    JackpotService.shouldListenBets = false;
    const jackpot = JackpotService.jackpot;
    if (!jackpot) throw new NoJackpotError();

    await JackpotService.updateJackpots(jackpot, {
      status: 'CLOSED',
      updatedAt: Date.now(),
    });

    await this.receiveLastBets();

    const { bets: jackpotBets, prizePool } = jackpot;
    const { winnerBet, winnerPrize, ticketDrawn } =
      await ProcessWinnerService.jackpot(jackpotBets, prizePool);

    await JackpotService.updateJackpots(jackpot, {
      winningBetRef: winnerBet,
      ticketDrawn,
      status: 'FINISHED',
      updatedAt: Date.now(),
      finishedAt: Date.now(),
    });

    // Jackpot animation delay
    await new Promise((resolve) =>
      setTimeout(resolve, jackpotAnimationDuration),
    );

    // Client balance update
    await BalanceService.softUpdateBalances(
      winnerBet.userInfo.userDocId,
      winnerPrize,
    );
    await this.saveAndUpdateGameHistory();
    // Potential errors: NoJackpotError || UnexpectedDatabaseError || JackpotWinnerProcessingError || RedisError
  }

  async forceFinishJackpot() {
    JackpotService.shouldListenBets = false;

    const jackpot = JackpotService.jackpot;
    if (!jackpot) throw new NoJackpotError();

    await JackpotService.updateJackpots(jackpot, {
      status: 'CANCELLED',
      updatedAt: Date.now(),
    });

    await JackpotBetsService.clearBetsQueue();

    // Jackpot Animation Delay
    await new Promise((resolve) =>
      setTimeout(resolve, jackpotAnimationDuration),
    );

    await this.saveAndUpdateGameHistory();

    // Potential errors: NoJackpotError || UnexpectedDatabaseError || JackpotWinnerProcessingError || RedisError
  }

  // Initialize jackpot service (loop)
  async initialize() {
    console.log('Jackpot Service Started');
    JackpotService.shouldListenBets = true;

    try {
      // Potential errors: UnexpectedDatabaseError
      await this.checkAndSetJackpot();

      // Potential errors: NoJackpotError || UnexpectedDatabaseError || RedisError
      this.processJackpotBetsQueue();

      // Potential errors: NoJackpotError
      const startedAt = await this.waitForJackpotToStart();

      await this.waitForJackpotToFinish(startedAt);

      // Potential errors: NoJackpotError || UnexpectedDatabaseError || JackpotWinnerProcessingError || RedisError
      await this.finishJackpot();

      await this.initialize();
    } catch (err) {
      JackpotService.shouldListenBets = false;
      // if (JackpotService.jackpot) await this.forceFinishJackpot(); - NEXT UPDATE!!!
      console.log('JACKPOT INTERRUPTED', err);
    }
  }
}

export default new JackpotService();
export { JackpotService as JackpotServiceClass };
