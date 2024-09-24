import ENVIRONMENT from './ENVIRONMENT';

const PROTOCOL = ENVIRONMENT.REACT_APP_HTTPS ? 'https://' : 'http://';

// SERVER
// https://serverdomain.com OU http://localhost
const SERVER_URL_WITH_PROTOCOL = `${PROTOCOL}${ENVIRONMENT.REACT_APP_SERVER_URL}`;

// SERVER PORT
const SERVER_PORT = ENVIRONMENT.REACT_APP_SERVER_PORT;

// https://serverdomain.com OU http://localhost:PORT
const SERVER_FULL_URL =
  ENVIRONMENT.REACT_APP_MODE === 'DEVELOPMENT'
    ? `${SERVER_URL_WITH_PROTOCOL}:${SERVER_PORT}`
    : SERVER_URL_WITH_PROTOCOL;

// https://serverdomain.com/api OU http://localhost:PORT/api
export const API_BASE = '';
export const API_URL = `${SERVER_FULL_URL}${API_BASE}`;

// CLIENT
// https://clientdomain.com OU http://localhost
const CLIENT_URL_WITH_PROTOCOL = `${PROTOCOL}${ENVIRONMENT.REACT_APP_CLIENT_URL}`;
// CLIENT PORT
const CLIENT_PORT = ENVIRONMENT.REACT_APP_CLIENT_PORT;
// https://client.domain.com OU http://localhost:PORT
export const CLIENT_FULL_URL =
  ENVIRONMENT.REACT_APP_MODE === 'PRODUCTION'
    ? CLIENT_URL_WITH_PROTOCOL
    : `${CLIENT_URL_WITH_PROTOCOL}:${CLIENT_PORT}`;

export const WS_PROTOCOL = ENVIRONMENT.REACT_APP_HTTPS ? 'wss://' : 'ws://';
const WS_API_URL_WITH_PROTOCOl = `${WS_PROTOCOL}${ENVIRONMENT.REACT_APP_SERVER_URL}:${
  ENVIRONMENT.REACT_APP_MODE === 'PRODUCTION' ? '' : SERVER_PORT
}${API_BASE}`;

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
    google: `${ENDPOINTS.AUTH}/google`,
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
  MAIN_URLS: { API_URL, WS_API_URL_WITH_PROTOCOl },
};

export default URLS;
