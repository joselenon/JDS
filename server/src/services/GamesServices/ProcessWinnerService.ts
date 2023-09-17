import { DEV_FEE } from '../../config/gameLogic/config';
import { IBetDBCreate, IBetRedis } from '../../config/interfaces/IBet';
import { IGameDB } from '../../config/interfaces/IGame';
import FirebaseService from '../FirebaseService';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

class ProcessWinnerService {
  static async jackpot(jackpotBets: IBetRedis[], prizePool: number) {
    const totalTickets = jackpotBets.reduce(
      (acc, bet) => (acc += bet.amountBet),
      0,
    );

    if (totalTickets !== prizePool) throw new Error('algo deu errado');

    const drawRandomTicket = getRandomInt(totalTickets - 1);
    const ticketDrawn: IGameDB['ticketDrawn'] = {
      ticket: drawRandomTicket,
      hash: '',
    };
    const winnerBet = jackpotBets.find((bet) => {
      if (
        drawRandomTicket >= bet.intervals[0] &&
        drawRandomTicket <= bet.intervals[1]
      ) {
        return bet;
      }
    });
    if (!winnerBet) {
      throw new Error('algo deu errado'); // optimize
    }

    const winnerPrize = Math.round(
      totalTickets - (totalTickets * DEV_FEE.JACKPOT) / 100,
    );
    await FirebaseService.updateDocument<IBetDBCreate>(
      'bets',
      winnerBet.docId,
      { amountReceived: winnerPrize },
    );

    return { winnerBet, winnerPrize, ticketDrawn };
  }
}

export default ProcessWinnerService;
