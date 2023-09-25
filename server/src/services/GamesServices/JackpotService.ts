// Jackpot system
import * as admin from 'firebase-admin';

import { IBetRedisCreate } from '../../config/interfaces/IBet';
import {
  IGameDBUpdate,
  IGameDB,
  IGameRedisUpdate,
  IGameRedis,
} from '../../config/interfaces/IGame';

import {
  ClientError,
  GameAlreadyStarted,
} from '../../config/errorTypes/ClientErrors';
import {
  NoJackpotInRedis,
  UnknownError,
} from '../../config/errorTypes/SystemErrors';
import getRedisKeyHelper from '../../helpers/redisHelper';
import pSubEventHelper from '../../helpers/pSubEventHelper';
import FirebaseService from '../FirebaseService';
import RedisService from '../RedisService';
import ProcessWinnerService from './ProcessWinnerService';
import BalanceService from '../BalanceService';
import { JackpotBetsService } from './BetsService';

const lastJackpotsCacheKey = getRedisKeyHelper('last_jackpots');
const jackpotCacheKey = getRedisKeyHelper('active_jackpot');
const jackpotBetsQueueCacheKey = getRedisKeyHelper('jackpot_bets_queue');
const jackpotDuration = 15 * 1000;
const jackpotAnimationDuration = 10 * 1000;

class JackpotService {
  // Durations measured per ms
  private shouldListenToBets: boolean = true;
  private activeIntervals: NodeJS.Timeout[] = [];

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
    await RedisService.set(
      jackpotCacheKey,
      jackpotRedisPayload,
      { inJSON: true },
      null,
    );
    JackpotService.emitPSub(jackpotRedisPayload);
  }

  // Creates a new jackpot on DB and Cache and send to Client
  async createNewJackpot() {
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
      jackpotDuration,
      jackpotAnimationDuration,
    };
    await RedisService.set(jackpotCacheKey, jackpotRedisPayload, {
      inJSON: true,
    });
    JackpotService.emitPSub(jackpotRedisPayload);
    return jackpotRedisPayload;
  }

  // Get jackpot info from Cache
  async getJackpotInRedis(): Promise<IGameRedis> {
    const jackpotInRedis = await RedisService.get<IGameRedis>(jackpotCacheKey, {
      inJSON: true,
    });
    if (!jackpotInRedis) throw new NoJackpotInRedis(); // Fix this
    return jackpotInRedis;
  }

  async getLastJackpotsInRedis(): Promise<IGameRedis[]> {
    const lastJackpotsInRedis = await RedisService.lRange<IGameRedis>(
      lastJackpotsCacheKey,
      { inJSON: true },
    );
    if (!lastJackpotsInRedis || lastJackpotsInRedis.length === 0) return [];
    return lastJackpotsInRedis;
  }

  // Checks if jackpot on Cache is updated, if not, it updates
  async checkAndSetJackpot() {
    try {
      const jackpotInRedis = await this.getJackpotInRedis();
      if (
        jackpotInRedis.status === 'FINISHED' ||
        jackpotInRedis.status === 'CANCELLED'
      ) {
        const newJackpot = await this.createNewJackpot();
        return newJackpot;
      }
      return jackpotInRedis;
    } catch (err) {
      if (err instanceof NoJackpotInRedis) {
        const newJackpot = await this.createNewJackpot();
        return newJackpot;
      }
    }
  }

  // Updates jackpot on DB, Cache and Client
  async createNewBetAndUpdateJackpots(newBetInfo: IBetRedisCreate) {
    try {
      const BetService = new JackpotBetsService(newBetInfo);
      await BetService.makeBet();
      console.log('New bet created!', newBetInfo);
    } catch (err) {
      if (!(err instanceof ClientError)) {
        this.shouldListenToBets = false;
        console.log(err);
      }
    }
  }

  // Creates the loop responsible for execute queues
  async processJackpotBetsQueue() {
    console.log('Listening to jackpot bets...');
    while (this.shouldListenToBets) {
      try {
        const task = await RedisService.lPop<IBetRedisCreate>(
          jackpotBetsQueueCacheKey,
          1,
          { inJSON: true },
        );
        if (!task) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }

        ////////////////////////////////////////////////////////////////
        if (task.amountBet === 10)
          throw new UnknownError('Erro aleatorio aqui');
        ////////////////////////////////////////////////////////////////

        await this.createNewBetAndUpdateJackpots(task);
      } catch (err) {
        console.log('Something went wrong... Stopping jackpot bets listener.');
        await this.forceFinishJackpot();
      }
    }
  }

  // Process bets done before jackpot finishing
  async receiveLastBets() {
    const { updatedAt } = await this.getJackpotInRedis();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const task = await RedisService.lPop<IBetRedisCreate>(
        jackpotBetsQueueCacheKey,
        1,
        { inJSON: true },
      );
      if (!task) break;

      if (task.createdAt < updatedAt!) {
        await this.createNewBetAndUpdateJackpots(task);
      } else {
        throw new GameAlreadyStarted(task.userInfo.userDocId);
      }
    }
    await RedisService.del(jackpotBetsQueueCacheKey);
  }

  // Listen to jackpot till it's closure, then triggers the last function 'finishJackpot'
  async listenStartedJackpot() {
    const checkJackpotStatus = async () => {
      const { startedAt: jackpotStartedAt } = await this.getJackpotInRedis();
      if (jackpotStartedAt) {
        clearInterval(jackpotInterval);
        await waitForJackpotToFinish(jackpotStartedAt);
      }
    };

    const waitForJackpotToFinish = async (jackpotStartedAt: number) => {
      const finishJackpotInterval = setInterval(async () => {
        const timeNow = new Date().getTime();
        const timeSinceJackpotStarted = timeNow - jackpotStartedAt;

        if (timeSinceJackpotStarted > jackpotDuration) {
          const jackpotInRedis = await this.getJackpotInRedis();
          clearInterval(finishJackpotInterval);
          await this.finishJackpot(jackpotInRedis);
        }
      }, 250);
      this.activeIntervals.push(finishJackpotInterval);
    };

    const jackpotInterval = setInterval(checkJackpotStatus, 250);
    this.activeIntervals.push(jackpotInterval);
  }

  async saveAndUpdateGameHistory() {
    const activeJackpot = await this.getJackpotInRedis();
    const redisLastJackpots = await this.getLastJackpotsInRedis();
    if (redisLastJackpots.length === 10) {
      await RedisService.rPop(lastJackpotsCacheKey, 1, { inJSON: true });
    }
    await RedisService.lPush(lastJackpotsCacheKey, activeJackpot, {
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
    this.activeIntervals.forEach((interval) => clearInterval(interval));
    this.shouldListenToBets = false;

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
    this.activeIntervals.forEach((interval) => clearInterval(interval));
    this.shouldListenToBets = false;

    const jackpotInRedis = await this.getJackpotInRedis();
    await JackpotService.updateJackpots(jackpotInRedis, {
      status: 'CANCELLED',
      updatedAt: Date.now(),
    });
    await this.saveAndUpdateGameHistory();
    this.initialize();
  }

  // Initialize jackpot service (loop)
  async initialize() {
    console.log('Jackpot Service Started');
    /*     await RedisService.del(jackpotCacheKey);
    await RedisService.del(jackpotBetsQueueCacheKey); */

    try {
      this.shouldListenToBets = true;
      this.processJackpotBetsQueue();
      await this.checkAndSetJackpot();
      await this.listenStartedJackpot();
    } catch (err) {
      this.shouldListenToBets = false;
      if (err instanceof ClientError) return;
      await this.forceFinishJackpot();
    }
  }
}

export default new JackpotService();
export { JackpotService };
