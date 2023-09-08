import axios from 'axios';

const AxiosConfig = axios.create({
  baseURL: 'http://localhost:4001/api/',
  timeout: 10000,
});

export default AxiosConfig;
