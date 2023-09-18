const API_RESPONSE_MSGS = {
  SUCCESS: {
    GET_MSG: 'Dados recebidos com sucesso.',
    UPDATE_MSG: 'Dados atualizados com sucesso.',
    REDEEM_CODE_MSG: 'Código resgatado com sucesso.',
  },

  ERROR: {
    SYSTEM_ERROR_MSGS: {
      DOCUMENT_NOT_IN_DB_MSG: 'Documento(s) não encontrado(s) no DB.',
      INVALID_PAYLOAD: 'Payload inválido.',
      REDIS: 'Erro no Redis.',
      NO_JACKPOT_IN_REDIS: 'Redis sem jackpot.',
    },

    CLIENT_ERROR_MSGS: {
      GENERIC_MSG: 'Houve um erro... já estamos trabalhando para corrigí-lo!',
      AUTH_MSG: 'Não autorizado.',
      CODE_NOT_FOUND: 'Código inválido.',
      CODE_USAGE_LIMIT: 'Limite de uso para o código atingido.',
      CODE_ALREADY_USED: 'Código já utilizado.',
      INSUFFICIENT_BALANCE: 'Saldo insuficiente.',
      GAME_ALREADY_STARTED: 'Jogo já começou.',
    },
  },
};

const ERRORS_CONFIG = {
  DB: {
    TYPE: 'Database',
    MSGS: {
      GET: API_RESPONSE_MSGS.ERROR.SYSTEM_ERROR_MSGS.DOCUMENT_NOT_IN_DB_MSG,
      UPDATE: API_RESPONSE_MSGS.ERROR.SYSTEM_ERROR_MSGS.INVALID_PAYLOAD,
    },
  },
  REDIS: {
    TYPE: 'Redis',
    // System Error
    msg: API_RESPONSE_MSGS.ERROR.SYSTEM_ERROR_MSGS.DOCUMENT_NOT_IN_DB_MSG,
  },

  GENERIC: {
    TYPE: 'Unknown',
    // Client Error
    MSGS: { Generic: API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.GENERIC_MSG },
  },
  AUTH: {
    TYPE: 'Authorization',
    // Client Error
    MSGS: { Unauthorized: API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.AUTH_MSG },
  },
  DEPOSIT: {
    TYPE: 'Deposit',
    MSGS: {
      // Client Error
      notFound: API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.CODE_NOT_FOUND,
      // Client Error
      usageLimit: API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.CODE_USAGE_LIMIT,
      // Client Error
      alreadyUsed: API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.CODE_ALREADY_USED,
    },
  },
  GAME: {
    TYPE: 'Game',
    MSGS: {
      // System Error
      noJackpotInRedis:
        API_RESPONSE_MSGS.ERROR.SYSTEM_ERROR_MSGS.NO_JACKPOT_IN_REDIS,
      // Client Error
      insufficientBalance:
        API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.INSUFFICIENT_BALANCE,
      // Client Error
      gameAlreadyStarted:
        API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.GAME_ALREADY_STARTED,
    },
  },
};

export { API_RESPONSE_MSGS, ERRORS_CONFIG };
