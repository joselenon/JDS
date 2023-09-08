import AppService from './services/AppService';
import startGamesServices from './services/GamesServices/startGamesServices';

async function startApp() {
  try {
    await AppService.initialize();
    await startGamesServices();
  } catch (err: any) {
    throw new Error(err);
  }
}

startApp();
