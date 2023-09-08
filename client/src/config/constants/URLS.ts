const MAIN_URL = `http://localhost:`;

const CLIENT_PORT = 3000;
const CLIENT_URL = `${MAIN_URL}${CLIENT_PORT}`;

const SERVER_PORT = 4001;
const SERVER_URL = `${MAIN_URL}${SERVER_PORT}`;

const API_BASE = '/api';
const API_URL = `${MAIN_URL}${SERVER_PORT}${API_BASE}`;

const ENDPOINTS = {
  GRAPHQL: '/graphql',
  EXTERNAL_APIS: '/externalapis',
  AUTH: '/auth',
  USER: '/user',
  DEPOSIT: '/deposit',
};

const API_ENDPOINTS = {
  GRAPHQL: `${SERVER_URL}${API_BASE}${ENDPOINTS.GRAPHQL}`,
  EXTERNAL_APIS: {
    youtube: `${SERVER_URL}${API_BASE}${ENDPOINTS.EXTERNAL_APIS}/youtube`,
  },
  AUTH: {
    steam: {
      initial: `${SERVER_URL}${API_BASE}${ENDPOINTS.AUTH}/steam`,
    },
  },
  USER: {
    update: `${SERVER_URL}${API_BASE}${ENDPOINTS.USER}/update`,
  },
  DEPOSIT: {
    code: `${SERVER_URL}${API_BASE}${ENDPOINTS.DEPOSIT}/code`,
  },
};

const URLS = {
  MAIN_URLS: { CLIENT_PORT, CLIENT_URL, SERVER_PORT, SERVER_URL, API_URL },
  ENDPOINTS: API_ENDPOINTS,
};

export default URLS;
