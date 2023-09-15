import Redis from 'ioredis';
import { promisify } from 'util';

import { TRedisCommands, TRedisOptions } from '../config/interfaces/IRedis';

export default class RedisService {
  private static client: Redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    // Will run every connection fail
    retryStrategy: (times) => {
      const maxRetries = 5;
      if (times === maxRetries) {
        return null;
      }
      const delay = Math.min(times * 100, 2000);
      return delay;
    },
  });

  private static promisifyCommand(command: TRedisCommands) {
    return promisify(RedisService.client[command]).bind(RedisService.client);
  }

  static del(key: string) {
    const syncDel = RedisService.promisifyCommand('del');
    return syncDel(key);
  }

  static set(
    key: string,
    value: any,
    options?: TRedisOptions,
    expirationInSeconds: number | null = null,
  ) {
    // calledBy && console.log(`Called by ${calledBy}.\n Value: ${value.bets}`);
    const syncSet = RedisService.promisifyCommand('set');
    const args = [key, options?.inJSON ? JSON.stringify(value) : value];
    if (expirationInSeconds) {
      args.push('EX', expirationInSeconds);
    }
    return syncSet(...args);
  }

  static async get<T>(
    key: string,
    options?: TRedisOptions,
  ): Promise<T | null | undefined> {
    try {
      const syncGet = RedisService.promisifyCommand('get');
      const data = await syncGet(key);
      if (data && options?.inJSON) {
        return JSON.parse(data);
      }
      return data as T | null;
    } catch (err) {
      console.log(err);
    }
  }

  static lPush(key: string, value: any, options?: TRedisOptions) {
    const syncLPush = RedisService.promisifyCommand('lpush');
    if (options?.inJSON) {
      const valueJSON = JSON.stringify(value);
      return syncLPush(key, valueJSON);
    }
    return syncLPush(key, value);
  }

  static rPush(key: string, value: any, options?: TRedisOptions) {
    const syncRPush = RedisService.promisifyCommand('rpush');
    if (options?.inJSON) {
      const valueJSON = JSON.stringify(value);
      return syncRPush(key, valueJSON);
    }
    return syncRPush(key, value);
  }

  static async lRange<T>(
    key: string,
    options?: TRedisOptions,
  ): Promise<T[] | null> {
    const syncLRange = RedisService.promisifyCommand('lrange');
    const dataJSON = await syncLRange(key, 0, -1);
    if (dataJSON && options?.inJSON) {
      const data = dataJSON.map((item: any) => {
        return JSON.parse(item);
      });
      return data;
    }
    return dataJSON;
  }

  // Removes and returns first element of the list
  static async lPop<T>(
    key: string,
    count: number,
    options?: TRedisOptions,
  ): Promise<T | null> {
    const syncLPop = RedisService.promisifyCommand('lpop');
    const data = await syncLPop(key, count);
    if (data && options?.inJSON) {
      return JSON.parse(data);
    }
    return data;
  }

  // Removes and returns last element of the list
  static async rPop<T>(
    key: string,
    count: number,
    options?: TRedisOptions,
  ): Promise<T | null> {
    const syncRPop = RedisService.promisifyCommand('rpop');
    const data = await syncRPop(key, count);
    if (data && options?.inJSON) {
      return JSON.parse(data);
    }
    return data;
  }
}
