import { IGameRedis } from '../../config/interfaces/IGame';
import RedisService from '../RedisService';

const test = async () => {
  const jackpot = await RedisService.get<IGameRedis>('last_jackpot', {
    inJSON: true,
  });
  console.log(jackpot);
};

test();
