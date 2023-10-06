import FirebaseCredentials from './config/app/FirebaseCredentials';
import ENVIRONMENT from './config/constants/ENVIRONMENT';
import AppService from './services/AppService';
import FirebaseService from './services/FirebaseService';
import startGamesServices from './services/GamesServices/startGamesServices';
import RedisService from './services/RedisService';

const FirebaseInstance = new FirebaseService(FirebaseCredentials);

const RedisInstance = new RedisService(
  ENVIRONMENT.REDIS_HOST,
  parseInt(ENVIRONMENT.REDIS_PORT),
  ENVIRONMENT.REDIS_PASSWORD,
);

async function initializeApp() {
  await AppService.initialize();

  startGamesServices();

  return { FirebaseInstance, RedisInstance };
}

initializeApp();

export { FirebaseInstance, RedisInstance };
