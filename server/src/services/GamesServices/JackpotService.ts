// Jackpot system
import * as admin from 'firebase-admin';

import { IBetRedisCreate } from '../../config/interfaces/IBet';
import {
  IGameDBUpdate,
  IGameDB,
  IGameRedisUpdate,
  IGameRedis,
} from '../../config/interfaces/IGame';

import { ClientError } from '../../config/errorTypes/ClientErrors';
import { NoJackpotInRedis } from '../../config/errorTypes/SystemErrors';
import getRedisKeyHelper from '../../helpers/redisHelper';
import pSubEventHelper from '../../helpers/pSubEventHelper';
import FirebaseService from '../FirebaseService';
import ProcessWinnerService from './ProcessWinnerService';
import BalanceService from '../BalanceService';
import { JackpotBetsService } from './BetsService';
import { RedisInstance } from '../..';

const lastJackpotsCacheKey = getRedisKeyHelper('last_jackpots');
const jackpotCacheKey = getRedisKeyHelper('active_jackpot');
export const jackpotBetsQueueCacheKey = getRedisKeyHelper('jackpot_bets_queue');
const jackpotDuration = 15 * 1000;
const jackpotAnimationDuration = 10 * 1000;

class JackpotService {
  // Durations measured per ms
  private shouldListenBets: boolean = true;

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
      const betRef = await FirebaseService.getDocumentRef('bets', docId);
      payloadToDB.bets = admin.firestore.FieldValue.arrayUnion(betRef);
    }
    if (payload.winningBetRef) {
      const { docId } = payload.winningBetRef;
      const winningBetRef = await FirebaseService.getDocumentRef('bets', docId);
      payloadToDB.winningBetRef = winningBetRef;
    }
    await FirebaseService.updateDocument('games', jackpotDocId, payloadToDB);

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
    await RedisInstance.set(
      jackpotCacheKey,
      jackpotRedisPayload,
      { inJSON: true },
      null,
    );
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
    const jackpotDocId = await FirebaseService.writeDocument(
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
  async getJackpotInRedis(): Promise<IGameRedis> {
    const jackpotInRedis = await RedisInstance.get<IGameRedis>(
      jackpotCacheKey,
      {
        inJSON: true,
      },
    );
    if (!jackpotInRedis) throw new NoJackpotInRedis(); // Fix this
    return jackpotInRedis;
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
  async checkAndSetJackpot() {
    try {
      let jackpotInRedis = await this.getJackpotInRedis();
      if (
        jackpotInRedis.status === 'FINISHED' ||
        jackpotInRedis.status === 'CANCELLED'
      ) {
        jackpotInRedis = await this.createNewJackpot();
      }
      return jackpotInRedis;
    } catch (err) {
      if (err instanceof NoJackpotInRedis) {
        const newJackpot = await this.createNewJackpot();
        return newJackpot;
      }
    }
  }

  // Creates the loop responsible for execute queues
  async processJackpotBetsQueue() {
    console.log('Listening to jackpot bets...');
    while (this.shouldListenBets) {
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

        const BetService = new JackpotBetsService(task);
        await BetService.makeBet();
      } catch (err) {
        if (err instanceof ClientError) {
          continue;
        } else {
          this.shouldListenBets = false;
          await this.forceFinishJackpot();
        }
      }
    }
  }

  // Process bets done before jackpot finishing
  async receiveLastBets() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const task = await RedisInstance.lPop<IBetRedisCreate>(
        jackpotBetsQueueCacheKey,
        1,
        { inJSON: true },
      );
      if (!task) break;
      const BetService = new JackpotBetsService(task);
      await BetService.makeBet();
    }
    await JackpotBetsService.clearBetsQueue();
  }

  // Listen to jackpot till it's closure, then triggers the last function 'finishJackpot'
  async listenStartedJackpot() {
    const waitForJackpotToFinish = async (jackpotStartedAt: number) => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const timeNow = new Date().getTime();
        const timeSinceJackpotStarted = timeNow - jackpotStartedAt;
        if (timeSinceJackpotStarted > jackpotDuration) {
          const jackpotInRedis = await this.getJackpotInRedis();
          await this.finishJackpot(jackpotInRedis);
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
    };

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { startedAt: jackpotStartedAt } = await this.getJackpotInRedis();
      if (jackpotStartedAt) {
        await waitForJackpotToFinish(jackpotStartedAt);
        break;
      } else {
        // Delay till next check
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }

  async saveAndUpdateGameHistory() {
    const activeJackpot = await this.getJackpotInRedis();
    const redisLastJackpots = await this.getLastJackpotsInRedis();
    if (redisLastJackpots.length === 10) {
      await RedisInstance.rPop(lastJackpotsCacheKey, 1, { inJSON: true });
    }
    await RedisInstance.lPush(lastJackpotsCacheKey, activeJackpot, {
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
  async finishJackpot(jackpotInRedis: IGameRedis) {
    this.shouldListenBets = false;

    await JackpotService.updateJackpots(jackpotInRedis, {
      status: 'CLOSED',
      updatedAt: Date.now(),
    });
    await this.receiveLastBets();

    const { bets: jackpotBets, prizePool } = jackpotInRedis;
    const { winnerBet, winnerPrize, ticketDrawn } =
      await ProcessWinnerService.jackpot(jackpotBets, prizePool);

    await JackpotService.updateJackpots(jackpotInRedis, {
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
    const jackpotInRedis = await this.getJackpotInRedis();
    await JackpotService.updateJackpots(jackpotInRedis, {
      status: 'CANCELLED',
      updatedAt: Date.now(),
    });
    await JackpotBetsService.clearBetsQueue();
    // Delay till next jackpot (for the animation to end)
    await new Promise((resolve) =>
      setTimeout(resolve, jackpotAnimationDuration),
    );
    await this.saveAndUpdateGameHistory();
    this.initialize();
  }

  // Initialize jackpot service (loop)
  async initialize() {
    console.log('Jackpot Service Started');
    this.shouldListenBets = true;
    try {
      await this.checkAndSetJackpot();
      this.processJackpotBetsQueue();
      await this.listenStartedJackpot();
    } catch (err) {
      this.shouldListenBets = false;
      if (err instanceof ClientError) return;
      await this.forceFinishJackpot();
    }
  }
}

export default new JackpotService();
export { JackpotService };
