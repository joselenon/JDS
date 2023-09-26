import ENVIRONMENT from './config/constants/ENVIRONMENT';
import AppService from './services/AppService';
import startGamesServices from './services/GamesServices/startGamesServices';
import RedisService from './services/RedisService';

AppService.initialize();

const RedisInstance = new RedisService(
  ENVIRONMENT.REDIS_HOST,
  parseInt(ENVIRONMENT.REDIS_PORT),
  ENVIRONMENT.REDIS_PASSWORD,
);

startGamesServices();

export { RedisInstance };
