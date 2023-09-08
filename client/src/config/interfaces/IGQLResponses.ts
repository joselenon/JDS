import { IBet } from './IBet';

export type TGetBalanceResponse = {
  balance: number;
};

export type TGetJackpotResponse = {
  docId: string;
  bets: IBet[];
  type: 'JACKPOT' | 'COINFLIP';
  winningBetRef?: IBet;
  prizePool: number;
  status: 'ACTIVE' | 'CLOSED' | 'FINISHED' | 'CANCELLED';
  createdAt: number;
  startedAt?: number;
  updatedAt?: number;
  finishedAt?: number;
  jackpotDuration: number;
  jackpotAnimationDuration: number;
};
