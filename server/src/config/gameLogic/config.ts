export const DEV_FEE = {
  // In percent
  JACKPOT: 2,
};

export const GAME_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
};

export const GAME_MODE = {
  JACKPOT: 'JACKPOT',
  COINFLIP: 'COINFLIP',
};

export type GameStatusProtocol = keyof typeof GAME_STATUS;
export type GameModeProtocol = keyof typeof GAME_MODE;
