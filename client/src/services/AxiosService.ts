import { AxiosError } from 'axios';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

import { TPayloads } from '../config/interfaces/IPayloads';
import IResponses from '../config/interfaces/IHTTPResponses';
import AxiosConfig from '../config/app/AxiosConfig';
import ERROR_MSGS from '../config/constants/ERROR_MSGS';

class AxiosService {
  private instance = AxiosConfig;

  private serversUpdatingMessageShown = false;

  public setToken(token: string) {
    this.instance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  async get<T>(endPoint: string) {
    try {
      const res: AxiosResponse<T> = await this.instance.get(endPoint);
      return res;
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' && !this.serversUpdatingMessageShown) {
        toast.error(ERROR_MSGS.SERVER_OFFLINE_MSG);
        this.serversUpdatingMessageShown = true;
      }
    }
  }

  async post<T>(endPoint: string, payload: TPayloads) {
    try {
      const res: AxiosResponse<IResponses<T>> = await this.instance.post(
        endPoint,
        payload,
        { withCredentials: true },
      );

      toast.success(res.data.message);

      return res;
    } catch (err: any) {
      if (err instanceof AxiosError) {
        if (err.code === 'ERR_NETWORK') {
          toast.error(ERROR_MSGS.SERVER_OFFLINE_MSG);
        }
      }
      toast.error(err.response?.data.message);
    }
  }

  async put<T>(endPoint: string, payload: TPayloads) {
    try {
      const res: AxiosResponse<IResponses<T>> = await this.instance.put(
        endPoint,
        payload,
        { withCredentials: true },
      );

      if (res.data.success) toast.success(res.data.message);

      return res;
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        toast.error(ERROR_MSGS.SERVER_OFFLINE_MSG);
      }
      toast.error(err.response?.data.message);
    }
  }
}

export default new AxiosService();
