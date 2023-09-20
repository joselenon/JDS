const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
const SERVER_FULL_URL = SERVER_PORT ? `${SERVER_URL}:${SERVER_PORT}` : SERVER_URL;

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
  MAIN_URLS: { SERVER_URL, API_URL },
};

export default URLS;
