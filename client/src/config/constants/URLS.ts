import ENVIRONMENT from './ENVIRONMENT';

export const PROTOCOL = ENVIRONMENT.REACT_APP_HTTPS ? 'https://' : 'http://';

const SERVER_DOMAIN = `${ENVIRONMENT.REACT_APP_SERVER_DOMAIN}`;
const SERVER_PORT = ENVIRONMENT.REACT_APP_SERVER_PORT;
const SERVER_FULL_URL =
  ENVIRONMENT.REACT_APP_MODE === 'DEVELOPMENT'
    ? `${PROTOCOL}${SERVER_DOMAIN}:${SERVER_PORT}`
    : `${PROTOCOL}${SERVER_DOMAIN}`;

const API_BASE = '/api';
const API_URL = `${SERVER_FULL_URL}${API_BASE}`;

console.log(`API URL: ${API_URL} \n SERVERFULLURL: ${SERVER_FULL_URL}`);

const ENDPOINTS = {
  GRAPHQL: '/graphql',
  EXTERNAL_APIS: '/externalapis',
  AUTH: '/auth',
  USER: '/user',
  DEPOSIT: '/deposit',
};

const API_ENDPOINTS = {
  GRAPHQL: `${ENDPOINTS.GRAPHQL}`,
  EXTERNAL_APIS: {
    youtube: `${ENDPOINTS.EXTERNAL_APIS}/youtube`,
  },
  AUTH: {
    steam: {
      initial: `${ENDPOINTS.AUTH}/steam`,
    },
  },
  USER: {
    update: `${ENDPOINTS.USER}/update`,
  },
  DEPOSIT: {
    code: `${ENDPOINTS.DEPOSIT}/code`,
  },
};

const URLS = {
  ENDPOINTS: API_ENDPOINTS,
  MAIN_URLS: { SERVER_DOMAIN, API_URL },
};

export default URLS;
