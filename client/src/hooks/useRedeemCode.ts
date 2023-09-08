import { TRedeemCodeResponse } from '../config/interfaces/IHTTPResponses';
import { IRedeemCodePayload } from '../config/interfaces/IPayloads';
import AxiosService from '../services/AxiosService';
import URLS from '../config/constants/URLS';

export default function useRedeemCode() {
  const handleRedeemCode = async (payload: IRedeemCodePayload) => {
    const res = await AxiosService.post<TRedeemCodeResponse>(
      URLS.ENDPOINTS.DEPOSIT.code,
      payload,
    );
    return res;
  };

  return handleRedeemCode;
}
