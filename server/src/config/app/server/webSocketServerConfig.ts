import { Server } from 'http';
import ENVIRONMENT from '../../constants/ENVIRONMENT';
import URLS from '../../constants/URLS';

const webSocketServerConfig = (httpServer: Server) => {
  return {
    server: httpServer,
    path: `${ENVIRONMENT.API_BASE}${URLS.ENDPOINTS.GRAPHQL}`,
  };
};

export default webSocketServerConfig;
