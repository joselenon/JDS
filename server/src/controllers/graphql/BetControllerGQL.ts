import {
  GameAlreadyStarted,
  InsufficientBalance,
} from '../../config/errorTypes/ClientErrors';
import {
  IBetControllerGQL,
  IBetRedisCreate,
} from '../../config/interfaces/IBet';
import { IJWTPayload } from '../../config/interfaces/IJWT';
import { IJackpotBetPayload } from '../../config/interfaces/IPayloads';

import getRedisKeyHelper from '../../helpers/redisHelper';
import BalanceService from '../../services/BalanceService';
import JackpotService from '../../services/GamesServices/JackpotService';
import RedisService from '../../services/RedisService';

class BetControllerGQL implements IBetControllerGQL {
  async makeBetOnJackpot(userInfo: IJWTPayload, payload: IJackpotBetPayload) {
    const { amountBet } = payload;
    const { userDocId } = userInfo;
    const { balance: userBalance } = await BalanceService.getBalance(userDocId);

    if (userBalance < amountBet) {
      throw new InsufficientBalance('Saldo insuficiente');
    }
    const jackpotInRedis = await JackpotService.getJackpotInRedis();
    if (!jackpotInRedis || jackpotInRedis.status === 'FINISHED') {
      throw new GameAlreadyStarted(userDocId);
    }

    const { docId: jackpotDocId } = jackpotInRedis;
    const betDBCreatePayload: IBetRedisCreate = {
      userInfo,
      amountBet,
      gameId: jackpotDocId,
      createdAt: Date.now(),
    };

    // Create a new task on Redis queue
    const cacheKey = getRedisKeyHelper('jackpot_bets_queue');
    await RedisService.rPush(cacheKey, betDBCreatePayload, { inJSON: true });
  }
}

export default new BetControllerGQL();
