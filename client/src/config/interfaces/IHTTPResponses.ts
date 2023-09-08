export default interface IResponses<T> {
  success: boolean;
  message: string;
  data: T;
}

export type TUpdateResponse = IResponses<null>;
export type TRedeemCodeResponse = IResponses<null>;
