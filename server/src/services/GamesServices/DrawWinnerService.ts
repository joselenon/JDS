import { IBetRedis } from '../../config/interfaces/IBet';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

class DrawWinnerService {
  static jackpot(jackpotBets: IBetRedis[]): IBetRedis {
    // eslint-disable-next-line no-useless-catch
    try {
      const totalTickets = jackpotBets.reduce(
        (acc, bet) => (acc += bet.amountBet),
        0,
      );
      const drawRandomTicket = getRandomInt(totalTickets - 1);
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
      return winnerBet;
    } catch (err) {
      throw err;
    }
  }
}

export default DrawWinnerService;
