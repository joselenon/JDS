import CREDENTIALS from './CREDENTIALS';

const PROTOCOL = CREDENTIALS.HTTPS ? 'https://' : 'http://';

const SERVER_URL = `${PROTOCOL}${CREDENTIALS.SERVER_DOMAIN}`;
if (!SERVER_URL) throw new Error('Algo deu errado - 1337');

const SERVER_PORT = CREDENTIALS.SERVER_PORT;
const SERVER_FULL_URL = CREDENTIALS.HTTPS
  ? SERVER_URL
  : `${SERVER_URL}:${SERVER_PORT}`;

const CLIENT_URL = `${PROTOCOL}${CREDENTIALS.CLIENT_DOMAIN}`;
if (!CLIENT_URL) throw new Error('Algo deu errado - 1338');

const CLIENT_PORT = CREDENTIALS.CLIENT_PORT;
const CLIENT_FULL_URL = CLIENT_PORT
  ? `${CLIENT_URL}:${CLIENT_PORT}`
  : CLIENT_URL;

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
      callback: `${ENDPOINTS.AUTH}/steam/callback`,
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
  MAIN_URLS: {
    CLIENT_PORT,
    CLIENT_URL,
    SERVER_PORT,
    SERVER_URL,
    API_URL,
    CLIENT_FULL_URL,
    SERVER_FULL_URL,
  },
  ENDPOINTS: API_ENDPOINTS,
};

export default URLS;
