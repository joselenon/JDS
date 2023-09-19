import CREDENTIALS from './CREDENTIALS';

const SERVER_URL = CREDENTIALS.SERVER_URL;
if (!SERVER_URL) throw new Error('Algo deu errado,');

const SERVER_PORT = CREDENTIALS.SERVER_PORT;
const SERVER_FULL_URL = SERVER_PORT
  ? `${SERVER_URL}:${SERVER_PORT}`
  : SERVER_URL;

const CLIENT_URL = CREDENTIALS.CLIENT_URL;
if (!CLIENT_URL) throw new Error('Algo deu errado,');
const CLIENT_PORT = CREDENTIALS.CLIENT_PORT;
const CLIENT_FULL_URL = CLIENT_PORT
  ? `${CLIENT_URL}:${CLIENT_PORT}`
  : CLIENT_URL;

const API_BASE = '/api';
const API_URL = `${SERVER_FULL_URL}${API_BASE}`;

const ENDPOINTS = {
  GRAPHQL: '/graphql',
  EXTERNAL_APIS: '/externalapis',
  AUTH: '/auth',
  USER: '/user',
  DEPOSIT: '/deposit',
};

const API_ENDPOINTS = {
  GRAPHQL: `${API_BASE}${ENDPOINTS.GRAPHQL}`,
  EXTERNAL_APIS: {
    youtube: `${API_BASE}${ENDPOINTS.EXTERNAL_APIS}/youtube`,
  },
  AUTH: {
    steam: {
      initial: `${API_BASE}${ENDPOINTS.AUTH}/steam`,
      callback: `${API_BASE}${ENDPOINTS.AUTH}/steam/callback`,
    },
  },
  USER: {
    update: `${API_BASE}${ENDPOINTS.USER}/update`,
  },
  DEPOSIT: {
    code: `${API_BASE}${ENDPOINTS.DEPOSIT}/code`,
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
  },
  ENDPOINTS: API_ENDPOINTS,
};

export default URLS;
