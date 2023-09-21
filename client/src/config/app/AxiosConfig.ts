import axios, { AxiosRequestConfig } from 'axios';
import URLS, { API_BASE } from '../constants/URLS';
import ENVIRONMENT from '../constants/ENVIRONMENT';

const AxiosConfig = axios.create({
  baseURL:
    ENVIRONMENT.REACT_APP_MODE === 'DEVELOPMENT' ? URLS.MAIN_URLS.API_URL : API_BASE,
  timeout: 10000,
} as AxiosRequestConfig);

export default AxiosConfig;
