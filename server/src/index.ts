import FirebaseCredentials from './config/app/FirebaseCredentials';
import ENVIRONMENT from './config/constants/ENVIRONMENT';
import AppService from './services/AppService';
import FirebaseService from './services/FirebaseService';
import startGamesServices from './services/GamesServices/startGamesServices';
import RedisService from './services/RedisService';

AppService.initialize();

const FirebaseInstance = new FirebaseService(FirebaseCredentials);

const RedisInstance = new RedisService(
  ENVIRONMENT.REDIS_HOST,
  parseInt(ENVIRONMENT.REDIS_PORT),
  ENVIRONMENT.REDIS_PASSWORD,
);

startGamesServices();

export { FirebaseInstance, RedisInstance };
