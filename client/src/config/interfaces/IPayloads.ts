export type TPayloads =
  | IUpdateUserInfoPayload
  | IRedeemCodePayload
  | IGoogleProfilePayload;

export interface IGoogleProfilePayload {
  accessToken: string | null;
}

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
