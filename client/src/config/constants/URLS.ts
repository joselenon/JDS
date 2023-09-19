const SERVER_URL = `http://jdsserverv1.gamblance.com`;

const API_BASE = '/api';

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
  ENDPOINTS: API_ENDPOINTS,
};

export default URLS;
