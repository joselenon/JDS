// Jackpot system
import * as admin from 'firebase-admin';

import { IBetRedisCreate } from '../../config/interfaces/IBet';
import {
  IGameDBUpdate,
  IGameDB,
  IGameRedisUpdate,
  IGameRedis,
} from '../../config/interfaces/IGame';

import { NoJackpot } from '../../config/errors/classes/SystemErrors';
import getRedisKeyHelper from '../../helpers/redisHelper';
import pSubEventHelper from '../../helpers/pSubEventHelper';
import ProcessWinnerService from './ProcessWinnerService';
import BalanceService from '../BalanceService';
import { JackpotBetsService } from './BetsService';
import { FirebaseInstance, RedisInstance } from '../..';
import {
  ClientError,
  GameAlreadyStarted,
} from '../../config/errors/classes/ClientErrors';

const lastJackpotsCacheKey = getRedisKeyHelper('last_jackpots');
const jackpotCacheKey = getRedisKeyHelper('active_jackpot');
export const jackpotBetsQueueCacheKey = getRedisKeyHelper('jackpot_bets_queue');
const jackpotDuration = 15 * 1000;
const jackpotAnimationDuration = 10 * 1000;

class JackpotService {
  private static jackpot: IGameRedis | undefined;

  // Durations measured per ms
  private static shouldListenBets: boolean = true;
  private allIntervals: NodeJS.Timeout[] = [];

  static getShouldListenBets() {
    return JackpotService.shouldListenBets;
  }

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
    jackpotInRedis: IGameRedis,
    payload: IGameRedisUpdate,
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
    /* await RedisInstance.set(
      jackpotCacheKey,
      jackpotRedisPayload,
      { inJSON: true },
      null,
    ); */
    JackpotService.jackpot = jackpotRedisPayload;
    JackpotService.emitPSub(jackpotRedisPayload);
  }

  // Creates a new jackpot on DB and Cache and send to Client
  async createNewJackpot(): Promise<IGameRedis> {
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
    const jackpotRedisPayload = {
      ...jackpotDBPayload,
      docId: jackpotDocId,
      winningBetRef: undefined,
      jackpotDuration,
      jackpotAnimationDuration,
    };
    await RedisInstance.set(jackpotCacheKey, jackpotRedisPayload, {
      inJSON: true,
    });
    JackpotService.emitPSub(jackpotRedisPayload);
    return jackpotRedisPayload;
  }

  // Get jackpot info from Cache
  static getJackpotInRedis(): IGameRedis | undefined {
    return JackpotService.jackpot;
    /*     const jackpotInRedis = await RedisInstance.get<IGameRedis>(
      jackpotCacheKey,
      {
        inJSON: true,
      },
    );
    if (jackpotInRedis) {
      return jackpotInRedis;
    } else {
      throw new NoJackpotInRedisError();
    } */
  }

  async getLastJackpotsInRedis(): Promise<IGameRedis[]> {
    const lastJackpotsInRedis = await RedisInstance.lRange<IGameRedis>(
      lastJackpotsCacheKey,
      { inJSON: true },
    );
    if (!lastJackpotsInRedis || lastJackpotsInRedis.length === 0) return [];
    return lastJackpotsInRedis;
  }

  // Checks if jackpot on Cache is updated, if not, it updates
  async checkAndSetJackpot(): Promise<IGameRedis> {
    try {
      let jackpotInRedis = await JackpotService.getJackpotInRedis();

      if (
        !jackpotInRedis ||
        jackpotInRedis.status === 'FINISHED' ||
        jackpotInRedis.status === 'CANCELLED'
      ) {
        jackpotInRedis = await this.createNewJackpot();
      }

      return (JackpotService.jackpot = jackpotInRedis);
    } catch (err) {
      // Potential errors: NoJackpotInRedisError ||  UnexpectedDatabaseError || RedisError
      if (err instanceof NoJackpot) {
        const newJackpot = await this.createNewJackpot();
        return newJackpot;
      } else {
        throw err;
      }
    }
  }

  // Creates the loop responsible for execute queues
  async processJackpotBetsQueue() {
    while (JackpotService.shouldListenBets) {
      try {
        const task = await RedisInstance.lPop<IBetRedisCreate>(
          jackpotBetsQueueCacheKey,
          1,
          { inJSON: true },
        );

        if (!task) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }
        if (!JackpotService.jackpot) {
          throw new GameAlreadyStarted(task.userInfo.userDocId);
        }

        const BetService = new JackpotBetsService(task, JackpotService.jackpot);
        await BetService.makeBet();
      } catch (err) {
        continue;
      }
    }
  }

  // Process bets done before jackpot finishing
  async receiveLastBets() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const task = await RedisInstance.lPop<IBetRedisCreate>(
          jackpotBetsQueueCacheKey,
          1,
          { inJSON: true },
        );

        if (!task) break;
        if (!JackpotService.jackpot) {
          throw new GameAlreadyStarted(task.userInfo.userDocId);
        }

        const BetService = new JackpotBetsService(task, JackpotService.jackpot);
        await BetService.makeBet();
      } catch (err) {
        continue;
      }
    }
    await JackpotBetsService.clearBetsQueue();
  }

  async waitForJackpotToStart(): Promise<number> {
    return new Promise((resolve) => {
      // Change to dynamic Database watcher
      const toStartInterval = setInterval(async () => {
        if (JackpotService.jackpot && JackpotService.jackpot.startedAt) {
          clearInterval(toStartInterval);
          resolve(JackpotService.jackpot.startedAt);
        }
      }, 100);
      this.allIntervals.push(toStartInterval);
    });
  }

  async waitForJackpotToFinish(jackpotStartedAt: number): Promise<void> {
    return new Promise((resolve) => {
      const toFinishInterval = setInterval(async () => {
        const timeNow = new Date().getTime();
        const timeSinceJackpotStarted = timeNow - jackpotStartedAt;

        if (timeSinceJackpotStarted > jackpotDuration) {
          clearInterval(toFinishInterval);
          resolve(await this.finishJackpot());
        }
      }, 100);
      this.allIntervals.push(toFinishInterval);
    });
  }

  async saveAndUpdateGameHistory() {
    const redisLastJackpots = await this.getLastJackpotsInRedis();

    if (!JackpotService.jackpot) throw new NoJackpot();

    if (redisLastJackpots.length === 10) {
      await RedisInstance.rPop(lastJackpotsCacheKey, 1, { inJSON: true });
    }

    await RedisInstance.lPush(lastJackpotsCacheKey, JackpotService.jackpot, {
      inJSON: true,
    });

    const redisLastJackpotsAtt = await this.getLastJackpotsInRedis();
    return pSubEventHelper('GET_LIVE_LAST_JACKPOTS', 'getLiveLastJackpots', {
      success: true,
      message: 'GET_MSG',
      data: redisLastJackpotsAtt,
    });
  }

  // Close jackpot, draw the winner and then finishes it
  async finishJackpot() {
    JackpotService.shouldListenBets = false;
    const jackpot = JackpotService.jackpot;

    if (!jackpot) {
      throw new NoJackpot();
    }

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

    // Delay till next jackpot (for the animation to end)
    await new Promise((resolve) =>
      setTimeout(resolve, jackpotAnimationDuration),
    );

    // Client balance update
    await BalanceService.softUpdateBalances(
      winnerBet.userInfo.userDocId,
      winnerPrize,
    );
    await this.saveAndUpdateGameHistory();
    this.initialize();
  }

  async forceFinishJackpot() {
    try {
      this.allIntervals.forEach((interval) => clearInterval(interval));
      JackpotService.shouldListenBets = false;
      const jackpot = JackpotService.jackpot!;

      await JackpotService.updateJackpots(jackpot, {
        status: 'CANCELLED',
        updatedAt: Date.now(),
      });
      await JackpotBetsService.clearBetsQueue();
      // Delay till next jackpot (for the animation to end)
      await new Promise((resolve) =>
        setTimeout(resolve, jackpotAnimationDuration),
      );
      await this.saveAndUpdateGameHistory();
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await this.forceFinishJackpot();
    }
  }

  // Initialize jackpot service (loop)
  async initialize() {
    console.log('Jackpot Service Started');
    JackpotService.shouldListenBets = true;

    try {
      // Potential errors: RedisError || UnexpectedDatabaseError
      await this.checkAndSetJackpot();

      // No errors to return since it hasn't await
      this.processJackpotBetsQueue();

      const startedAt = await this.waitForJackpotToStart();
      await this.waitForJackpotToFinish(startedAt);
    } catch (err) {
      JackpotService.shouldListenBets = false;
      if (err instanceof ClientError) return;
      if (JackpotService.jackpot) await this.forceFinishJackpot();
      console.log('JACKPOT INTERRUPTED', err);
    }
  }
}

export default new JackpotService();
export { JackpotService as JackpotServiceClass };
