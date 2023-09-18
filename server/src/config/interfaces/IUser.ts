import IFirebaseQueryResponse from './IFirebaseQueryResponse';

export default interface IUser {
  username: string;
  steamid: string;
  avatar: string;
  balance: number;
  tradeLink?: string;
  email?: string;
}

export interface IUserJWTPayload {
  userDocId: string;
  username: string;
  avatar: string;
}

export interface IUserControllerGQL {
  getUser(steamid: string): Promise<IFirebaseQueryResponse<IUser> | null>;
}
