import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import { TUpdateResponse } from '../config/interfaces/IHTTPResponses';
import { IUpdateUserInfoPayload } from '../config/interfaces/IPayloads';
import AxiosService from '../services/AxiosService';
import { setToken } from '../redux/features/authSlice';
import { JWTCookie } from '../config/app/CookiesConfig';
import URLS from '../config/constants/URLS';

export default function useUpdateUserInfo() {
  const dispatch = useDispatch();

  const handleUpdateUserInfo = async (payload: IUpdateUserInfoPayload) => {
    const res = await AxiosService.put<TUpdateResponse>(
      URLS.ENDPOINTS.USER.update,
      payload,
    );
    if (res) {
      const setCookieHeader = res.headers['set-cookie'] || [];

      const newTokenValue = setCookieHeader
        .map((cookie) => cookie.split('; ')[0])
        .find((cookie) => cookie.startsWith('token='))
        ?.split('=')[1];

      if (newTokenValue) {
        Cookies.set('token', newTokenValue, JWTCookie.config);
        dispatch(setToken(newTokenValue));
      }
      return res;
    }
  };

  return handleUpdateUserInfo;
}
