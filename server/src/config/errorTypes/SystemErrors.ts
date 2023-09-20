import { ERRORS_CONFIG } from '../constants/RESPONSES';

export abstract class SystemError extends Error {
  constructor(message: string, type: string) {
    super(message);
    this.name = `System Error - ${type}`;
  }
}

export abstract class DBError extends SystemError {
  constructor(message: string, type: string = ERRORS_CONFIG.DB.TYPE) {
    super(message, type);
  }
}

export class DocumentNotFound extends DBError {
  constructor(message: string = ERRORS_CONFIG.DB.MSGS.GET) {
    super(message);
  }
}

export class InvalidPayload extends DBError {
  constructor(message: string = ERRORS_CONFIG.DB.MSGS.UPDATE) {
    super(message);
  }
}

export class RedisError extends SystemError {
  constructor(message: string) {
    super(message, ERRORS_CONFIG.REDIS.TYPE);
  }
}

export class NoJackpotInRedis extends SystemError {
  constructor(message: string = ERRORS_CONFIG.GAME.MSGS.noJackpotInRedis) {
    super(message, ERRORS_CONFIG.REDIS.TYPE);
  }
}
