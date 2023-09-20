import pSubEventHelper from '../../helpers/pSubEventHelper';
import { ERRORS_CONFIG } from '../constants/RESPONSES';

export abstract class ClientError extends Error {
  private status: number;

  constructor(status: number, message: string, type: string) {
    super(message);
    this.name = `Client Error - ${type}`;
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}

export class GenericError extends ClientError {
  constructor(message: string = ERRORS_CONFIG.GENERIC.MSGS.Generic) {
    super(500, message, ERRORS_CONFIG.GENERIC.TYPE);
  }
}

export class AuthError extends ClientError {
  constructor(message: string = ERRORS_CONFIG.AUTH.MSGS.Unauthorized) {
    super(401, message, ERRORS_CONFIG.AUTH.TYPE);
  }
}

export class CodeNotFound extends ClientError {
  constructor(message: string = ERRORS_CONFIG.DEPOSIT.MSGS.notFound) {
    super(400, message, ERRORS_CONFIG.DEPOSIT.TYPE);
  }
}

export class CodeUsageLimitError extends ClientError {
  constructor(message: string = ERRORS_CONFIG.DEPOSIT.MSGS.usageLimit) {
    super(400, message, ERRORS_CONFIG.DEPOSIT.TYPE);
  }
}

export class CodeAlreadyUsed extends ClientError {
  constructor(message: string = ERRORS_CONFIG.DEPOSIT.MSGS.alreadyUsed) {
    super(400, message, ERRORS_CONFIG.DEPOSIT.TYPE);
  }
}

export class InsufficientBalance extends ClientError {
  constructor(
    private userDocId: string,
    message: string = ERRORS_CONFIG.GAME.MSGS.insufficientBalance,
  ) {
    super(400, message, ERRORS_CONFIG.GAME.TYPE);
    this.sendPSub();
  }

  sendPSub() {
    return pSubEventHelper(
      'GET_LIVE_BALANCE',
      'getLiveBalance',
      { success: false, message: 'INSUFFICIENT_BALANCE', data: { balance: 0 } },
      this.userDocId,
    );
  }
}

export class GameAlreadyStarted extends ClientError {
  constructor(
    private userDocId: string,
    message: string = ERRORS_CONFIG.GAME.MSGS.gameAlreadyStarted,
  ) {
    super(400, message, ERRORS_CONFIG.GAME.TYPE);
    this.sendPSub();
  }

  sendPSub() {
    return pSubEventHelper(
      'GET_LIVE_BALANCE',
      'getLiveBalance',
      { success: false, message: 'GAME_ALREADY_STARTED', data: { balance: 0 } },
      this.userDocId,
    );
  }
}
