import { IBet } from './IBet';

export interface IGQLResponses<T> {
  success: boolean;
  message: string;
  data: T;
}

export type TGetJackpotResponse = {
  docId: string;
  bets: IBet[];
  type: 'JACKPOT' | 'COINFLIP';
  winningBetRef?: IBet;
  ticketDrawn?: { ticket: number; hash: string };
  prizePool: number;
  status: 'ACTIVE' | 'CLOSED' | 'FINISHED' | 'CANCELLED';
  createdAt: number;
  startedAt?: number;
  updatedAt?: number;
  finishedAt?: number;
  jackpotDuration: number;
  jackpotAnimationDuration: number;
};
