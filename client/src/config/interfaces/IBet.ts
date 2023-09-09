import { IUserJWTPayload } from './IUser';

export interface IBet {
  docId: string;
  intervals: number[];
  amountBet: number;
  amountReceived: number;
  createdAt: number;
  gameId: string;
  userInfo: IUserJWTPayload;
}
