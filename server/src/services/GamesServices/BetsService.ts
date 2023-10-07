/* eslint-disable no-useless-catch */
import { FirebaseInstance, RedisInstance } from '../..';
import {
  ClientError,
  GameAlreadyStartedError,
  InsufficientBalanceError,
} from '../../config/errors/classes/ClientErrors';
import { IBetDBCreate, IBetRedisCreate } from '../../config/interfaces/IBet';
import { IGameInfo, IGameInfoUpdate } from '../../config/interfaces/IGame';
import {
  JackpotServiceClass,
  jackpotBetsQueueCacheKey,
} from './JackpotService';
import BalanceService from '../BalanceService';

class JackpotBetsService {
  constructor(
    private betInfo: IBetRedisCreate,
    private jackpot: IGameInfo,
  ) {}

  static async clearBetsQueue() {
    await RedisInstance.del(jackpotBetsQueueCacheKey);
    return true;
  }

  async checkJackpotBetValidity() {
    const { docId, status } = this.jackpot;
    const { gameId, userInfo, amountBet } = this.betInfo;

    if (docId !== gameId || status === 'CLOSED' || status === 'FINISHED') {
      throw new GameAlreadyStartedError(userInfo.userDocId);
    }

    const userBalance = await BalanceService.getBalance(userInfo.userDocId);

    if (amountBet > userBalance.balance) {
      throw new InsufficientBalanceError(userInfo.userDocId);
    }
    // Potential errors: GameAlreadyStartedError || InsufficientBalanceError || RedisError
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
    // Potential errors: UnexpectedDatabaseError
  }

  async updateJackpotsAndBalance(newBetDocId: string, intervals: number[]) {
    const { amountBet, userInfo } = this.betInfo;
    const { prizePool } = this.jackpot;

    const jackpotUpdatePayload: IGameInfoUpdate = {
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
    // Potential errors: UnexpectedDatabaseError
  }

  async makeBet() {
    try {
      // Potential errors: GameAlreadyStartedError || InsufficientBalanceError || RedisError
      await this.checkJackpotBetValidity();

      // Potential errors: UnexpectedDatabaseError
      const { newBetDocId, intervals } = await this.createBetInDB();

      // Potential errors: UnexpectedDatabaseError
      await this.updateJackpotsAndBalance(newBetDocId, intervals);
    } catch (err) {
      if (err instanceof ClientError) return;
      throw err;
    }
  }
}

export { JackpotBetsService };
