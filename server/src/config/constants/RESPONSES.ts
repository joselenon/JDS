const RESPONSE_CONFIG = {
  SUCCESS: {
    GET_MSG: 'Dados recebidos com sucesso.',
    UPDATE_MSG: 'Dados atualizados com sucesso.',
    REDEEM_CODE_MSG: 'Código resgatado com sucesso.',
  },

  ERROR: {
    TYPES: {
      Unknown: 'Unknown',
      Generic: 'Generic',
      Database: 'Database',
      Redis: 'Redis',
      Authorization: 'Authorization',
      Deposit: 'Deposit',
      Game: 'Game',
    },

    SYSTEM_ERROR_MSGS: {
      DOCUMENT_NOT_IN_DB_MSG: 'Documento(s) não encontrado(s) no DB',
      INVALID_PAYLOAD: 'Payload inválido',
      REDIS: 'Erro no Redis',
      NO_JACKPOT: 'No jackpot at the moment...',
    },

    CLIENT_ERROR_MSGS: {
      GENERIC_MSG: 'Houve um erro... já estamos trabalhando para corrigí-lo!',
      AUTH_MSG: 'Não autorizado',
      CODE_NOT_FOUND: 'Código inválido',
      CODE_USAGE_LIMIT: 'Limite de uso para o código atingido',
      CODE_ALREADY_USED: 'Código já utilizado',
      INVALID_AMOUNT_BET: 'Valor inválido',
      INSUFFICIENT_BALANCE: 'Saldo insuficiente',
      GAME_ALREADY_STARTED: 'Jogo já começou',
    },
  },
};

export { RESPONSE_CONFIG };
