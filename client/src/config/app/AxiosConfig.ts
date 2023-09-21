import axios, { AxiosRequestConfig } from 'axios';
import URLS from '../constants/URLS';

const AxiosConfig = axios.create({
  baseURL: URLS.MAIN_URLS.HTTP_API_URL,
  timeout: 10000,
} as AxiosRequestConfig);

export default AxiosConfig;
