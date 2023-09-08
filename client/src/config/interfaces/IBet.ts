import { IUserJWTPayload } from './IUser';

export interface IBet {
  docId: string;
  intervals: number[];
  amount: number;
  createdAt: number;
  gameId: string;
  userInfo: IUserJWTPayload;
}
