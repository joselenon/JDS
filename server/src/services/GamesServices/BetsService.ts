import { FirebaseInstance, RedisInstance } from '../..';
import {
  GameAlreadyStarted,
  InsufficientBalance,
} from '../../config/errorTypes/ClientErrors';
import { IBetDBCreate, IBetRedisCreate } from '../../config/interfaces/IBet';
import { IGameRedis, IGameRedisUpdate } from '../../config/interfaces/IGame';
import JackpotServiceInstance, {
  JackpotService,
  jackpotBetsQueueCacheKey,
} from './JackpotService';
import BalanceService from '../BalanceService';

class JackpotBetsService {
  private jackpotInfo: IGameRedis | undefined;

  constructor(private betInfo: IBetRedisCreate) {}

  static async clearBetsQueue() {
    await RedisInstance.del(jackpotBetsQueueCacheKey);
    return true;
  }

  async getJackpot() {
    return (this.jackpotInfo =
      await JackpotServiceInstance.getJackpotInRedis());
  }

  async checkJackpotBetValidity() {
    if (!this.jackpotInfo) throw new Error('Algo deu errado.');

    const { docId, status } = this.jackpotInfo;
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
    if (!this.jackpotInfo) throw new Error('Algo deu errado.');

    const { prizePool } = this.jackpotInfo;
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
    if (!this.jackpotInfo) throw new Error('Algo deu errado.');

    const { amountBet, userInfo } = this.betInfo;
    const { prizePool } = this.jackpotInfo;

    const jackpotUpdatePayload: IGameRedisUpdate = {
      bets: [{ ...this.betInfo, docId: newBetDocId, intervals }],
      prizePool: prizePool + amountBet,
    };
    if (this.jackpotInfo.bets.length === 0) {
      jackpotUpdatePayload.startedAt = Date.now();
    }

    await JackpotService.updateJackpots(this.jackpotInfo, jackpotUpdatePayload);
    await BalanceService.softUpdateBalances(userInfo.userDocId, -amountBet);
  }

  async makeBet() {
    await this.getJackpot();
    await this.checkJackpotBetValidity();
    const { newBetDocId, intervals } = await this.createBetInDB();
    await this.updateJackpotsAndBalance(newBetDocId, intervals);
  }
}

export { JackpotBetsService };
