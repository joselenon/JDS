// Errors occurred because of unauthorized or invalid requests by the user (shared with client)
import pSubEventHelper from '../../../helpers/pSubEventHelper';
import { RESPONSE_CONFIG } from '../../constants/RESPONSES';

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
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS.GENERIC_MSG,
  ) {
    super(500, message, RESPONSE_CONFIG.ERROR.TYPES.Generic);
  }
}

export class AuthError extends ClientError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS.AUTH_MSG,
  ) {
    super(401, message, RESPONSE_CONFIG.ERROR.TYPES.Authorization);
  }
}

export class EmailAlreadyExistsError extends ClientError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS
      .EMAIL_ALREADY_EXISTS,
  ) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.UserInfo);
  }
}

export class UserUpdateInfoError extends ClientError {
  constructor(message: string) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.UserInfo);
  }
}

export class CodeNotFound extends ClientError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS.CODE_NOT_FOUND,
  ) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.Deposit);
  }
}

export class CodeUsageLimitError extends ClientError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS.CODE_USAGE_LIMIT,
  ) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.Deposit);
  }
}

export class CodeAlreadyUsed extends ClientError {
  constructor(
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS.CODE_ALREADY_USED,
  ) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.Deposit);
  }
}

export class InvalidAmountBet extends ClientError {
  constructor(
    private userDocId: string,
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS
      .INVALID_AMOUNT_BET,
  ) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.Game);
    this.sendPSub();
  }

  sendPSub() {
    return pSubEventHelper(
      'GET_LIVE_BALANCE',
      'getLiveBalance',
      { success: false, message: 'INVALID_AMOUNT_BET', data: { balance: 0 } },
      this.userDocId,
    );
  }
}

export class InsufficientBalanceError extends ClientError {
  constructor(
    private userDocId: string,
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS
      .INSUFFICIENT_BALANCE,
  ) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.Game);
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

export class GameAlreadyStartedError extends ClientError {
  constructor(
    private userDocId: string,
    message: string = RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS
      .GAME_ALREADY_STARTED,
  ) {
    super(400, message, RESPONSE_CONFIG.ERROR.TYPES.Game);
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
