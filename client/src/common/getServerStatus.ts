import AxiosService from '../services/AxiosService';
import { AnyAction, Dispatch } from 'redux';
import { setServerStatus } from '../redux/features/serverSlice';
import URLS from '../config/constants/URLS';

export default async function getServerStatus(dispatch: Dispatch<AnyAction>) {
  const res = await AxiosService.get(URLS.ENDPOINTS.EXTERNAL_APIS.youtube);
  res ? dispatch(setServerStatus(true)) : dispatch(setServerStatus(false));
}
