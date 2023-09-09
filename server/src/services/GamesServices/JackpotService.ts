import * as admin from 'firebase-admin';

import {
  IBetDBCreate,
  IBetRedis,
  IBetRedisCreate,
} from '../../config/interfaces/IBet';
import {
  IGameDBUpdate,
  IGameDB,
  IGameUpdate,
  IGameRedis,
} from '../../config/interfaces/IGame';

import getRedisKeyHelper from '../../helpers/redisHelper';
import pSubEventHelper from '../../helpers/pSubEventHelper';
import FirebaseService from '../FirebaseService';
import RedisService from '../RedisService';
import DrawWinnerService from './DrawWinnerService';
import BalanceService from '../BalanceService';

class JackpotService {
  // Durations measured per ms
  private jackpotDuration: number = 15 * 1000;
  private jackpotAnimationDuration: number = 10 * 1000;
  private jackpotCacheKey: any = getRedisKeyHelper('last_jackpot');
  private jackpotBetsQueueCacheKey = getRedisKeyHelper('jackpot_bets_queue');
  private shouldKeepRunning: boolean = true;
  private isJackpotIntervalRunning: boolean = false;

  getConfig() {
    return {
      jackpotDuration: this.jackpotDuration,
      jackpotAnimationDuration: this.jackpotAnimationDuration,
    };
  }

  // Helper function to update every DB, Cache and Client jackpots info
  async updateJackpots(
    jackpotInRedis: IGameRedis,
    payload: IGameUpdate,
    calledBy: string,
  ) {
    try {
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
        const winningBetRef = await FirebaseService.getDocumentRef(
          'bets',
          docId,
        );
        payloadToDB.winningBetRef = winningBetRef;
      }
      await FirebaseService.updateDocument('games', jackpotDocId, payloadToDB);

      // Redis Update
      const payloadToRedis = { ...jackpotInRedis, ...payload };
      if (payload.bets) {
        payloadToRedis.bets = [...jackpotInRedis.bets, ...payload.bets];
      }
      await RedisService.set(
        this.jackpotCacheKey,
        payloadToRedis,
        {
          inJSON: true,
        },
        null,
        calledBy,
      );
      pSubEventHelper('GET_REDIS_JACKPOT', 'getLiveJackpot', {
        ...payloadToRedis,
        ...this.getConfig(),
      });
    } catch (err) {
      console.log(err);
    }
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
    };
    await RedisService.set(this.jackpotCacheKey, jackpotRedisPayload, {
      inJSON: true,
    });
    pSubEventHelper('GET_REDIS_JACKPOT', 'getLiveJackpot', {
      ...jackpotRedisPayload,
      ...this.getConfig(),
    });
    return jackpotRedisPayload;
  }

  // Get jackpot info from Cache
  async getJackpotInRedis(): Promise<IGameRedis> {
    const jackpotInRedis = await RedisService.get<IGameRedis>(
      this.jackpotCacheKey,
      { inJSON: true },
    );
    if (!jackpotInRedis) throw new Error('No jackpot in Redis'); // Fix this
    return jackpotInRedis;
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
      const newJackpot = await this.createNewJackpot();
      return newJackpot;
    }
  }

  // Updates jackpot on DB, Cache and Client
  async createNewBetAndUpdateJackpots(newBetInfo: IBetRedisCreate) {
    console.log('New bet created!', newBetInfo);

    const { amountBet, createdAt, gameId, userInfo } = newBetInfo;
    const { userDocId } = userInfo;
    const jackpotInRedis = await this.getJackpotInRedis();
    const {
      docId: jackpotDocId,
      prizePool: jackpotPrizePool,
      status: jackpotStatus,
      bets: jackpotBets,
    } = jackpotInRedis;

    // VALIDATIONS
    // Compares gameId provided when the bet was made, in case doesn't match with active jackpot, the bet is cancelled (Error)
    if (
      jackpotStatus === 'FINISHED' ||
      jackpotStatus === 'CLOSED' ||
      gameId !== jackpotDocId
    ) {
      throw new Error('Jogo Encerrado');
    }

    // Create bet in DB
    const userRef = await FirebaseService.getDocumentRef('users', userDocId);
    const betDBCreatePayload: IBetDBCreate = {
      amountBet,
      amountReceived: 0,
      createdAt,
      gameId,
      userRef,
    };
    const newBetDocId = await FirebaseService.writeDocument(
      'bets',
      betDBCreatePayload,
    );

    // Update jackpot info
    const jackpotUpdatePayload: IGameUpdate = {
      bets: [{ ...newBetInfo, docId: newBetDocId }],
      prizePool: jackpotPrizePool + amountBet,
      updatedAt: Date.now(),
    };
    if (jackpotBets.length === 0) {
      jackpotUpdatePayload.startedAt = Date.now();
    }
    await this.updateJackpots(
      jackpotInRedis,
      jackpotUpdatePayload,
      'createNewBetAndUpdateJackpots',
    );

    // ! Soft update (untrustable)
    await BalanceService.softUpdateBalances(userDocId, -amountBet);
  }

  // Creates the loop responsible for execute queues
  async processJackpotBetsQueue() {
    console.log('Escutando queue de apostas...');
    while (this.shouldKeepRunning) {
      try {
        const task = await RedisService.lPop<IBetRedisCreate>(
          this.jackpotBetsQueueCacheKey,
          1,
          {
            inJSON: true,
          },
        );
        // If queue is empty wait 0.5 sec till next loop
        if (!task) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        await this.createNewBetAndUpdateJackpots(task);
      } catch (err: any) {
        throw new Error(err);
      }
    }
  }

  // Check when the jackpot ends to finish it
  async listenStartedJackpot() {
    // OPTIMIZE SEVERILY

    const checkTimeToFinish = async (jackpotStartedAt: number) => {
      const interval = setInterval(async () => {
        const timeNow = new Date().getTime();
        const timeSinceJackpotStarted = timeNow - jackpotStartedAt;
        if (timeSinceJackpotStarted > this.jackpotDuration) {
          const jackpotInRedis = await this.getJackpotInRedis();
          clearInterval(interval);
          await this.finishJackpot(jackpotInRedis);
        }
      }, 500);
    };

    const jackpotInterval: any = async () => {
      try {
        const jackpotInRedis = await this.getJackpotInRedis();
        const { startedAt: jackpotStartedAt } = jackpotInRedis;
        if (jackpotStartedAt) {
          clearInterval(interval);
          return checkTimeToFinish(jackpotStartedAt);
        } else {
          clearInterval(interval);
          return setTimeout(() => jackpotInterval(), 500);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const interval = setInterval(jackpotInterval, 500);
  }

  async processWinningBet(
    winningBetRedis: IBetRedis,
    jackpotPrizePool: number,
  ) {
    const devCut = 2; // 2% Dev fee
    const winnerPrize = Math.round(
      jackpotPrizePool - (jackpotPrizePool * devCut) / 100,
    );
    await FirebaseService.updateDocument<IBetDBCreate>(
      'bets',
      winningBetRedis.docId,
      { amountReceived: winnerPrize },
    );
    return winnerPrize;
  }

  // Close jackpot, draw the winner and then finishes it
  async finishJackpot(jackpotInRedis: IGameRedis) {
    try {
      const { bets: jackpotBets, prizePool: jackpotPrizePool } = jackpotInRedis;
      /*
      // Close jackpot bets
      const jackpotUpdatePayload1: IGameUpdate = {
        updatedAt: Date.now(),
        status: 'CLOSED',
      };
      await this.updateJackpots(
        jackpotInRedis,
        jackpotUpdatePayload1,
        'finishJackpot - (close bets)',
      );
 */
      // Draw the winner
      const winningBetRedis = await DrawWinnerService.jackpot(jackpotBets);
      const winnerPrize = await this.processWinningBet(
        winningBetRedis,
        jackpotPrizePool,
      );

      await this.updateJackpots(
        jackpotInRedis,
        {
          winningBetRef: winningBetRedis,
          status: 'FINISHED',
          updatedAt: Date.now(),
        },
        'finishJackpot - (finish jackpot)',
      );

      // Delay till next jackpot (for the animation to end)
      await new Promise((resolve) =>
        setTimeout(resolve, this.jackpotAnimationDuration),
      );

      await BalanceService.softUpdateBalances(
        winningBetRedis.userInfo.userDocId,
        winnerPrize,
      );
      this.isJackpotIntervalRunning = false;
    } catch (err) {
      this.shouldKeepRunning = false;
      console.log(err);
    }
  }

  // Initialize jackpot service (loop)
  async initialize() {
    console.log('Jackpot Service Initialized');

    // Clear any outdated data
    await RedisService.del(this.jackpotCacheKey);
    await RedisService.del(this.jackpotBetsQueueCacheKey);

    // Starts bets listener (monitor incoming bets and apply them to the system)
    this.processJackpotBetsQueue();

    // Starts the jackpots loop
    const jackpotInterval = setInterval(async () => {
      try {
        if (!this.isJackpotIntervalRunning) {
          this.isJackpotIntervalRunning = true;
          await this.checkAndSetJackpot();
          await this.listenStartedJackpot();
        }
      } catch (err) {
        clearInterval(jackpotInterval);
        this.shouldKeepRunning = false; // Check if error is not ClientError before this
      }
    }, 500); // optimize
  }
}

export default new JackpotService();
