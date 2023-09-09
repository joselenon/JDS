export type TPayloads = IUpdateUserInfoPayload | IRedeemCodePayload;

export interface IUpdateUserInfoPayload {
  email: string;
  tradeLink: string;
}

export interface IRedeemCodePayload {
  code: string;
}

export interface IMakeBetPayload {
  amountBet: number;
}
