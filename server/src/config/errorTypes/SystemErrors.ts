// Errors occured with the system (not shared with client)
import { RESPONSE_CONFIG } from '../constants/RESPONSES';

export abstract class SystemError extends Error {
  constructor(message: string, type: string) {
    super(message);
    this.name = `System Error - ${type}`;
  }
}

export abstract class DatabaseError extends SystemError {
  constructor(
    message: string,
    type: string = RESPONSE_CONFIG.ERROR.TYPES.Database,
  ) {
    super(message, type);
  }
}

export class UnexpectedDatabaseError extends DatabaseError {
  constructor(
    message: string,
    type: string = RESPONSE_CONFIG.ERROR.TYPES.Generic,
  ) {
    super(message, type);
  }
}

export class DocumentNotFoundError extends DatabaseError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.SYSTEM_ERROR_MSGS
      .DOCUMENT_NOT_IN_DB_MSG,
  ) {
    super(message);
  }
}

export class InvalidPayloadError extends DatabaseError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.SYSTEM_ERROR_MSGS.INVALID_PAYLOAD,
  ) {
    super(message);
  }
}

export class RedisError extends SystemError {
  constructor(message: string) {
    super(message, RESPONSE_CONFIG.ERROR.TYPES.Redis);
  }
}

export class NoJackpotInRedisError extends SystemError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.SYSTEM_ERROR_MSGS
      .NO_JACKPOT_IN_REDIS,
  ) {
    super(message, RESPONSE_CONFIG.ERROR.TYPES.Game);
  }
}

export class JackpotWinnerProcessingError extends SystemError {
  constructor(message: string) {
    super(message, RESPONSE_CONFIG.ERROR.TYPES.Game);
  }
}
