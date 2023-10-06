/* eslint-disable no-useless-catch */
import { FirebaseInstance, RedisInstance } from '../..';
import {
  ClientError,
  GameAlreadyStarted,
  GenericError,
  InsufficientBalance,
} from '../../config/errors/classes/ClientErrors';
import { IBetDBCreate, IBetRedisCreate } from '../../config/interfaces/IBet';
import { IGameRedis, IGameRedisUpdate } from '../../config/interfaces/IGame';
import {
  JackpotServiceClass,
  jackpotBetsQueueCacheKey,
} from './JackpotService';
import BalanceService from '../BalanceService';

class JackpotBetsService {
  constructor(
    private betInfo: IBetRedisCreate,
    private jackpot: IGameRedis,
  ) {}

  static async clearBetsQueue() {
    await RedisInstance.del(jackpotBetsQueueCacheKey);
    return true;
  }

  async checkJackpotBetValidity() {
    const { docId, status } = this.jackpot;
    const { gameId, userInfo, amountBet } = this.betInfo;
    const userBalance = await BalanceService.getBalance(userInfo.userDocId);

    if (docId !== gameId || status === 'CLOSED' || status === 'FINISHED') {
      throw new GameAlreadyStarted(userInfo.userDocId);
    }
    if (amountBet > userBalance.balance) {
      throw new InsufficientBalance(userInfo.userDocId);
    }
  }

  async processIntervals() {
    const { prizePool } = this.jackpot;
    const { amountBet } = this.betInfo;

    const startInterval = prizePool === 0 ? 0 : prizePool + 1;
    const endInterval = startInterval + amountBet - 1;
    return [startInterval, endInterval];
  }

  async createBetInDB() {
    const { amountBet, createdAt, gameId, userInfo } = this.betInfo;
    const intervals = await this.processIntervals();

    const userRef = await FirebaseInstance.getDocumentRef(
      'users',
      userInfo.userDocId,
    );
    const betDBCreatePayload: IBetDBCreate = {
      amountBet,
      createdAt,
      gameId,
      userRef,
      intervals,
      amountReceived: 0,
    };
    const newBetDocId = await FirebaseInstance.writeDocument(
      'bets',
      betDBCreatePayload,
    );

    return { newBetDocId, intervals };
  }

  async updateJackpotsAndBalance(newBetDocId: string, intervals: number[]) {
    const { amountBet, userInfo } = this.betInfo;
    const { prizePool } = this.jackpot;

    const jackpotUpdatePayload: IGameRedisUpdate = {
      bets: [{ ...this.betInfo, docId: newBetDocId, intervals }],
      prizePool: prizePool + amountBet,
    };
    if (this.jackpot.bets.length === 0) {
      jackpotUpdatePayload.startedAt = Date.now();
    }

    await JackpotServiceClass.updateJackpots(
      this.jackpot,
      jackpotUpdatePayload,
    );
    await BalanceService.softUpdateBalances(userInfo.userDocId, -amountBet);
  }

  async makeBet() {
    try {
      await this.checkJackpotBetValidity();
      const { newBetDocId, intervals } = await this.createBetInDB();
      await this.updateJackpotsAndBalance(newBetDocId, intervals);
    } catch (err) {
      if (err instanceof ClientError) throw err;
      throw new GenericError();
    }
  }
}

export { JackpotBetsService };
