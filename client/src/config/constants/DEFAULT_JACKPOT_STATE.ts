import { TGetJackpotResponse } from '../interfaces/IGQLResponses';

export const DEFAULT_JACKPOT_STATE: TGetJackpotResponse = {
  bets: [],
  createdAt: 0,
  docId: '',
  jackpotDuration: 0,
  jackpotAnimationDuration: 0,
  prizePool: 0,
  status: 'ACTIVE',
  type: 'JACKPOT',
};
