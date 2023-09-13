import * as admin from 'firebase-admin';

import { IBetDBCreate, IBetRedisCreate } from '../../config/interfaces/IBet';
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
import ProcessWinnerService from './ProcessWinnerService';
import BalanceService from '../BalanceService';
import {
  ClientError,
  GameAlreadyStarted,
  InsufficientBalance,
} from '../../config/errorTypes/ClientErrors';
import { NoJackpotInRedis } from '../../config/errorTypes/SystemErrors';

class JackpotService {
  // Durations measured per ms
  private jackpotDuration: number = 60 * 1000;
  private jackpotAnimationDuration: number = 10 * 1000;
  private jackpotCacheKey: any = getRedisKeyHelper('last_jackpot');
  private jackpotBetsQueueCacheKey = getRedisKeyHelper('jackpot_bets_queue');
  private shouldListenToBets: boolean = true;
  private isJackpotRunning: boolean = false;

  getConfig() {
    return {
      jackpotDuration: this.jackpotDuration,
      jackpotAnimationDuration: this.jackpotAnimationDuration,
    };
  }

  // Helper function to update every DB, Cache and Client jackpots info
  async updateJackpots(jackpotInRedis: IGameRedis, payload: IGameUpdate) {
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
      );
      pSubEventHelper('GET_REDIS_JACKPOT', 'getLiveJackpot', {
        success: true,
        message: 'GET_MSG',
        data: {
          ...payloadToRedis,
          ...this.getConfig(),
        },
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
      success: true,
      message: 'GET_MSG',
      data: {
        ...jackpotRedisPayload,
        ...this.getConfig(),
      },
    });
    return jackpotRedisPayload;
  }

  // Get jackpot info from Cache
  async getJackpotInRedis(): Promise<IGameRedis> {
    const jackpotInRedis = await RedisService.get<IGameRedis>(
      this.jackpotCacheKey,
      { inJSON: true },
    );
    if (!jackpotInRedis) throw new NoJackpotInRedis(); // Fix this
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
      if (err instanceof NoJackpotInRedis) {
        const newJackpot = await this.createNewJackpot();
        return newJackpot;
      }
    }
  }

  // Updates jackpot on DB, Cache and Client
  async createNewBetAndUpdateJackpots(newBetInfo: IBetRedisCreate) {
    try {
      const { amountBet, createdAt, gameId, userInfo } = newBetInfo;
      const { userDocId } = userInfo;
      const { balance } = await BalanceService.getBalance(userDocId);
      if (amountBet > balance) throw new InsufficientBalance(userDocId);

      const jackpotInRedis = await this.getJackpotInRedis();
      if (jackpotInRedis.finishedAt) {
        throw new GameAlreadyStarted(userDocId);
      }

      console.log('New bet created!', newBetInfo);
      const {
        docId: jackpotDocId,
        prizePool: jackpotPrizePool,
        status: jackpotStatus,
        bets: jackpotBets,
      } = jackpotInRedis;

      // criar intervalos
      const startInterval = jackpotPrizePool === 0 ? 0 : jackpotPrizePool + 1;
      const endInterval = startInterval + amountBet - 1;

      // VALIDATIONS
      // Compares gameId provided when the bet was made, in case doesn't match with active jackpot, the bet is cancelled (Error)
      if (
        jackpotStatus === 'FINISHED' ||
        jackpotStatus === 'CLOSED' ||
        gameId !== jackpotDocId
      ) {
        throw new GameAlreadyStarted(userDocId);
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
        bets: [
          {
            ...newBetInfo,
            docId: newBetDocId,
            intervals: [startInterval, endInterval],
          },
        ],
        prizePool: jackpotPrizePool + amountBet,
        // updatedAt: Date.now(),
      };
      if (jackpotBets.length === 0) {
        jackpotUpdatePayload.startedAt = Date.now();
      }
      await this.updateJackpots(jackpotInRedis, jackpotUpdatePayload);

      // ! Soft update (untrustable)
      await BalanceService.softUpdateBalances(
        userDocId,
        -amountBet,
        'Deduzindo da aposta',
      );
    } catch (err) {
      if (!(err instanceof ClientError)) {
        this.shouldListenToBets = false;
        console.log(err);
      }
    }
  }

  // Creates the loop responsible for execute queues
  async processJackpotBetsQueue() {
    try {
      console.log('Escutando queue de apostas...');
      while (this.shouldListenToBets) {
        const task = await RedisService.lPop<IBetRedisCreate>(
          this.jackpotBetsQueueCacheKey,
          1,
          { inJSON: true },
        );
        if (!task) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }
        await this.createNewBetAndUpdateJackpots(task);
      }
    } catch (err) {
      if (!(err instanceof ClientError) && !(err instanceof NoJackpotInRedis)) {
        this.shouldListenToBets = false;
        console.log(err);
      }
    }
  }

  async receiveLastBets() {
    const { updatedAt } = await this.getJackpotInRedis();

    while (true) {
      const task = await RedisService.lPop<IBetRedisCreate>(
        this.jackpotBetsQueueCacheKey,
        1,
        { inJSON: true },
      );
      if (!task) {
        break;
      }
      try {
        if (task.createdAt < updatedAt!) {
          await this.createNewBetAndUpdateJackpots(task);
        } else {
          throw new GameAlreadyStarted(task.userInfo.userDocId);
        }
      } catch (err) {
        console.log(err);
      }
    }
    await RedisService.del(this.jackpotBetsQueueCacheKey);
  }

  async listenStartedJackpot() {
    try {
      const checkJackpotStatus = async () => {
        const jackpotInRedis = await this.getJackpotInRedis();
        const { startedAt: jackpotStartedAt } = jackpotInRedis;

        if (jackpotStartedAt) {
          clearInterval(jackpotInterval);
          await waitForJackpotToFinish(jackpotStartedAt);
        }
      };

      const waitForJackpotToFinish = async (jackpotStartedAt: number) => {
        const finishJackpotInterval = setInterval(async () => {
          const timeNow = new Date().getTime();
          const timeSinceJackpotStarted = timeNow - jackpotStartedAt;

          if (timeSinceJackpotStarted > this.jackpotDuration) {
            const jackpotInRedis = await this.getJackpotInRedis();
            clearInterval(finishJackpotInterval);
            await this.finishJackpot(jackpotInRedis);
          }
        }, 250);
      };

      const jackpotInterval = setInterval(checkJackpotStatus, 250);
    } catch (err) {
      if (!(err instanceof ClientError)) {
        this.shouldListenToBets = false;
        throw err;
      }
    }
  }

  // Close jackpot, draw the winner and then finishes it
  async finishJackpot(jackpotInRedis: IGameRedis) {
    try {
      this.shouldListenToBets = false;
      await this.updateJackpots(jackpotInRedis, {
        status: 'CLOSED',
        updatedAt: Date.now(),
      });
      await this.receiveLastBets();

      const { bets: jackpotBets, prizePool } = jackpotInRedis;
      console.log('Jackpot antes de finalizar', jackpotInRedis);
      const { winnerBet, winnerPrize } = await ProcessWinnerService.jackpot(
        jackpotBets,
        prizePool,
      );

      await this.updateJackpots(jackpotInRedis, {
        winningBetRef: winnerBet,
        status: 'FINISHED',
        updatedAt: Date.now(),
        finishedAt: Date.now(),
      });
      console.log('JACKPOT FINALIZADOOOOO.');

      // Delay till next jackpot (for the animation to end)
      await new Promise((resolve) =>
        setTimeout(resolve, this.jackpotAnimationDuration),
      );
      // Client balance update
      await BalanceService.softUpdateBalances(
        winnerBet.userInfo.userDocId,
        winnerPrize,
        'Atualizando balança vencedor',
      );
      this.isJackpotRunning = false;
    } catch (err) {
      if (!(err instanceof ClientError)) {
        this.shouldListenToBets = false;
        console.log(err);
      }
    }
  }

  // Initialize jackpot service (loop)
  async initialize() {
    console.log('Jackpot Service Initialized');
    await RedisService.del(this.jackpotCacheKey);
    await RedisService.del(this.jackpotBetsQueueCacheKey);

    // Starts the jackpots loop
    const jackpotInterval = setInterval(async () => {
      try {
        // Validation for the functions to not get into a loop and accumulate
        if (!this.isJackpotRunning) {
          this.isJackpotRunning = true;
          this.shouldListenToBets = true;
          this.processJackpotBetsQueue();
          await this.checkAndSetJackpot();
          await this.listenStartedJackpot();
        }
      } catch (err) {
        console.log('entrou');
        clearInterval(jackpotInterval);
        this.shouldListenToBets = false; // Check if error is not ClientError before this
        if (err instanceof NoJackpotInRedis) {
          await this.checkAndSetJackpot();
          await this.initialize();
        }
      }
    }, 500); // optimize
  }
}

export default new JackpotService();
