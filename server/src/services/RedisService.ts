import Redis from 'ioredis';
import { promisify } from 'util';

import { TRedisCommands, TRedisOptions } from '../config/interfaces/IRedis';
import ENVIRONMENT from '../config/constants/ENVIRONMENT';

class RedisService {
  private client: Redis;

  constructor(host: string, port: number, password: string = '') {
    this.client = new Redis({
      host,
      port,
      password,

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
  }

  private promisifyCommand(command: TRedisCommands) {
    return promisify(this.client[command]).bind(this.client);
  }

  del(key: string) {
    const syncDel = this.promisifyCommand('del');
    return syncDel(key);
  }

  set(
    key: string,
    value: any,
    options?: TRedisOptions,
    expirationInSeconds: number | null = null,
  ) {
    const syncSet = this.promisifyCommand('set');
    const args = [key, options?.inJSON ? JSON.stringify(value) : value];
    if (expirationInSeconds) {
      args.push('EX', expirationInSeconds);
    }
    return syncSet(...args);
  }

  async get<T>(
    key: string,
    options?: TRedisOptions,
  ): Promise<T | null | undefined> {
    try {
      const syncGet = this.promisifyCommand('get');
      const data = await syncGet(key);
      if (data && options?.inJSON) {
        return JSON.parse(data);
      }
      return data as T | null;
    } catch (err) {
      console.log(err);
    }
  }

  lPush(key: string, value: any, options?: TRedisOptions) {
    const syncLPush = this.promisifyCommand('lpush');
    if (options?.inJSON) {
      const valueJSON = JSON.stringify(value);
      return syncLPush(key, valueJSON);
    }
    return syncLPush(key, value);
  }

  rPush(key: string, value: any, options?: TRedisOptions) {
    const syncRPush = this.promisifyCommand('rpush');
    if (options?.inJSON) {
      const valueJSON = JSON.stringify(value);
      return syncRPush(key, valueJSON);
    }
    return syncRPush(key, value);
  }

  async lRange<T>(key: string, options?: TRedisOptions): Promise<T[] | null> {
    const syncLRange = this.promisifyCommand('lrange');
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
  async lPop<T>(
    key: string,
    count: number,
    options?: TRedisOptions,
  ): Promise<T | null> {
    const syncLPop = this.promisifyCommand('lpop');
    const data = await syncLPop(key, count);
    if (data && options?.inJSON) {
      return JSON.parse(data);
    }
    return data;
  }

  // Removes and returns last element of the list
  async rPop<T>(
    key: string,
    count: number,
    options?: TRedisOptions,
  ): Promise<T | null> {
    const syncRPop = this.promisifyCommand('rpop');
    const data = await syncRPop(key, count);
    if (data && options?.inJSON) {
      return JSON.parse(data);
    }
    return data;
  }
}

// Redis connection (cloud server)
export default new RedisService(
  ENVIRONMENT.REDIS_HOST,
  parseInt(ENVIRONMENT.REDIS_PORT),
  ENVIRONMENT.REDIS_PASSWORD,
);
