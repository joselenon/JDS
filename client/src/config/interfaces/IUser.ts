export interface IUserInfo {
  userDocId: string;
  username: string;
  email: string;
  steamid: string;
  balance: number;
  avatar: string;
  tradeLink: string;
}

export interface IUserJWTPayload {
  userDocId: string;
  username: string;
  avatar: string;
}
