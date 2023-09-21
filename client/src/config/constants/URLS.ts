import ENVIRONMENT from './ENVIRONMENT';

export const PROTOCOL = ENVIRONMENT.REACT_APP_HTTPS ? 'https://' : 'http://';

// 'localhost' | 'jds.gamblance'
const SERVER_DOMAIN = `${ENVIRONMENT.REACT_APP_SERVER_DOMAIN}`;

// '4000'
const SERVER_PORT = ENVIRONMENT.REACT_APP_SERVER_PORT;

// 'http://localhost:4000' | 'https://jds.gamblance.com'
const SERVER_FULL_URL =
  ENVIRONMENT.REACT_APP_MODE === 'PRODUCTION'
    ? `${PROTOCOL}${SERVER_DOMAIN}.com`
    : `${PROTOCOL}${SERVER_DOMAIN}:${SERVER_PORT}`;

export const API_BASE = '/api';
const API_URL = `${SERVER_FULL_URL}${API_BASE}`;

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
