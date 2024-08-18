import IFirebaseQueryResponse from './IFirebase';

export default interface IUser {
  username: string;
  steamid: string;
  avatar: string;
  balance: number;
  tradeLink?: string;
  email: {
    value: string;
    verified: boolean;
    lastEmail: string;
    updatedAt: number;
  };
}

export interface IUserUpdatePayload {
  email?: string;
  tradeLink?: string;
}

export interface IUserJWTPayload {
  userDocId: string;
  username: string;
  avatar: string;
}

export interface IUserControllerGQL {
  getUser(steamid: string): Promise<IFirebaseQueryResponse<IUser> | null>;
}
