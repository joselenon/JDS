import * as admin from 'firebase-admin';

import FirebaseCredentials from './config/app/FirebaseCredentials';
import ENVIRONMENT from './config/constants/ENVIRONMENT';
import AppService from './services/AppService';
import FirestoreService from './services/FirestoreService';
import startGamesServices from './services/GamesServices/startGamesServices';
import RedisService from './services/RedisService';

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(FirebaseCredentials),
});
const FirebaseInstance = new FirestoreService();

const RedisInstance = new RedisService(
  ENVIRONMENT.REDIS_HOST,
  parseInt(ENVIRONMENT.REDIS_PORT),
  ENVIRONMENT.REDIS_PASSWORD,
);

async function init() {
  await AppService.initialize();

  startGamesServices();

  return { FirebaseInstance, RedisInstance };
}

init();

export { FirebaseInstance, RedisInstance, firebaseApp };
