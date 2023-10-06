import { RedisInstance } from '../..';
import {
  GameAlreadyStarted,
  InsufficientBalance,
  InvalidAmountBet,
} from '../../config/errors/classes/ClientErrors';
import {
  IBetControllerGQL,
  IBetRedisCreate,
} from '../../config/interfaces/IBet';
import { IJWTPayload } from '../../config/interfaces/IJWT';
import { IJackpotBetPayload } from '../../config/interfaces/IPayloads';

import getRedisKeyHelper from '../../helpers/redisHelper';
import BalanceService from '../../services/BalanceService';
import { JackpotServiceClass } from '../../services/GamesServices/JackpotService';

class BetControllerGQL implements IBetControllerGQL {
  async makeBetOnJackpot(userInfo: IJWTPayload, payload: IJackpotBetPayload) {
    const { amountBet } = payload;
    const { userDocId } = userInfo;
    const { balance: userBalance } = await BalanceService.getBalance(userDocId);

    if (amountBet <= 0) {
      throw new InvalidAmountBet(userDocId);
    }
    if (userBalance < amountBet) {
      throw new InsufficientBalance('Saldo insuficiente');
    }
    const jackpotInRedis = await JackpotServiceClass.getJackpotInRedis();
    if (!jackpotInRedis || jackpotInRedis.status === 'FINISHED') {
      throw new GameAlreadyStarted(userDocId);
    }

    const shouldPushBet = JackpotServiceClass.getShouldListenBets();
    if (!shouldPushBet) throw new GameAlreadyStarted(userDocId);

    const { docId: jackpotDocId } = jackpotInRedis;
    const betDBCreatePayload: IBetRedisCreate = {
      userInfo,
      amountBet,
      gameId: jackpotDocId,
      createdAt: Date.now(),
    };

    // Create a new task on Redis queue
    const cacheKey = getRedisKeyHelper('jackpot_bets_queue');
    await RedisInstance.rPush(cacheKey, betDBCreatePayload, { inJSON: true });
  }
}

export default new BetControllerGQL();
