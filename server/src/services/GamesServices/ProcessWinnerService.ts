import { FirebaseInstance } from '../..';
import { JackpotWinnerProcessingError } from '../../config/errors/classes/SystemErrors';
import { DEV_FEE } from '../../config/gameLogic/config';
import { IBetDBCreate, IBetRedis } from '../../config/interfaces/IBet';
import { IGameDB } from '../../config/interfaces/IGame';

function getRandomInt(max: number) {
  try {
    return Math.floor(Math.random() * max);
  } catch (err: any) {
    throw new JackpotWinnerProcessingError(err);
  }
}

class ProcessWinnerService {
  static async jackpot(jackpotBets: IBetRedis[], prizePool: number) {
    const totalTickets = jackpotBets.reduce(
      (acc, bet) => (acc += bet.amountBet),
      0,
    );

    if (totalTickets !== prizePool) {
      throw new JackpotWinnerProcessingError(
        "Total tickets and prizepool didn't match",
      );
    }

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
      throw new JackpotWinnerProcessingError("Winner didn't found"); // optimize
    }

    // Run function to pay dev account
    const winnerPrize = Math.round(
      totalTickets - (totalTickets * DEV_FEE.JACKPOT) / 100,
    );
    await FirebaseInstance.updateDocument<IBetDBCreate>(
      'bets',
      winnerBet.docId,
      { amountReceived: winnerPrize },
    );

    return { winnerBet, winnerPrize, ticketDrawn };
    // Potential errors:  JackpotWinnerProcessingError || UnexpectedDatabaseError
  }
}

export default ProcessWinnerService;
