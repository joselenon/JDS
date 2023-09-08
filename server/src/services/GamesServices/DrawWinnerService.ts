import { IBetRedis } from '../../config/interfaces/IBet';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

class DrawWinnerService {
  static jackpot(jackpotBets: IBetRedis[]): IBetRedis {
    // eslint-disable-next-line no-useless-catch
    try {
      const totalTickets = jackpotBets.reduce(
        (acc, bet) => (acc += bet.amount),
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

/*
const betsmock: IBetRedis[] = [
  {
    intervals: [0, 5],
    amount: 6,
    createdAt: 1,
    gameId: 'asd',
    userId: 'Jogador 1',
  },
  {
    intervals: [6, 25],
    amount: 20,
    createdAt: 2,
    gameId: 'asd',
    userId: 'Jogador 2',
  },
];

const totalTickets = betsmock.reduce((acc, bet) => {
  console.log('accumulator', acc, '\nbet', bet);
  return (acc += bet.amount);
}, 0);
console.log(totalTickets);

const drawRandomTicket = getRandomInt(totalTickets - 1);

console.log('drawRandomTicket', drawRandomTicket);

const winnerBet = betsmock.find((bet) => {
  if (
    drawRandomTicket >= bet.intervals[0] &&
    drawRandomTicket <= bet.intervals[1]
  ) {
    return bet;
  }
});
console.log(winnerBet);
 */
