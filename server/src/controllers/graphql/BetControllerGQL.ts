import {
  IBetControllerGQL,
  IBetRedisCreate,
} from '../../config/interfaces/IBet';
import { IJWTPayload } from '../../config/interfaces/IJWT';
import { IJackpotBetPayload } from '../../config/interfaces/IPayloads';
import getRedisKeyHelper from '../../helpers/redisHelper';
import JackpotService from '../../services/GamesServices/JackpotService';
import RedisService from '../../services/RedisService';

class BetControllerGQL implements IBetControllerGQL {
  async makeBetOnJackpot(userInfo: IJWTPayload, payload: IJackpotBetPayload) {
    const { amount: betAmount } = payload;
    const jackpotInRedis = await JackpotService.getJackpotInRedis();
    if (!jackpotInRedis) throw new Error('Aguarde a prox...'); // Criar erros dos tipos

    const { docId: jackpotDocId, prizePool: jackpotPrizePool } = jackpotInRedis;

    // Set ticket intervals (assists DrawWinner.jackpot)
    const startInterval = jackpotPrizePool === 0 ? 0 : jackpotPrizePool + 1;
    const endInterval = startInterval + betAmount - 1;

    const betDBCreatePayload: IBetRedisCreate = {
      userInfo,
      intervals: [startInterval, endInterval],
      amount: betAmount,
      gameId: jackpotDocId,
      createdAt: Date.now(),
    };
    console.log('Payload bet: ', betDBCreatePayload);

    // Create a new task on Redis queue
    const cacheKey = getRedisKeyHelper('jackpot_bets_queue');
    await RedisService.rPush(cacheKey, betDBCreatePayload, { inJSON: true });
  }
}

export default new BetControllerGQL();
