import JackpotService from './JackpotService';

async function startGamesServices() {
  await JackpotService.initialize();
}

export default startGamesServices;
