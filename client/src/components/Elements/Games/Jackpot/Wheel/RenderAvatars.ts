import seedrandom from 'seedrandom';
import { IBet } from '../../../../../config/interfaces/IBet';

interface IPlayers {
  username: string;
  avatar: string;
  amount: number;
}

function seedShuffler(array: string[]) {
  const newArray = [...array];
  const random = seedrandom(`avatars`);
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

class RenderAvatars {
  private totalAvatars: number = 110;
  private order: string[] = [];

  constructor(
    private bets: IBet[],
    private prizePool: number,
  ) {}

  normalRender() {
    // Get multiple bets between same players all together
    const uniquePlayers: IPlayers[] = [];
    this.bets.forEach((bet: IBet) => {
      const userFound = uniquePlayers.find(
        (user) => user.username === bet.userInfo.username,
      );
      if (userFound) {
        userFound.amount += bet.amount;
      } else {
        const { userInfo, amount } = bet;
        uniquePlayers.push({
          username: userInfo.username,
          avatar: userInfo.avatar,
          amount,
        });
      }
    });

    const order: string[] = [];
    uniquePlayers.forEach((player) => {
      const chanceOfWinning = player.amount / this.prizePool;
      const amountOfAvatars = Math.round(this.totalAvatars * chanceOfWinning);
      for (let count = 0; count < amountOfAvatars; count++) {
        order.push(player.avatar);
      }
    });
    const shuffledOrder = seedShuffler(order);
    this.order = shuffledOrder;
    return this.order;
  }

  winnerRender(winningBetRef: IBet) {
    this.normalRender();
    const winningBet = this.bets.find((bet) => bet.docId === winningBetRef.docId);
    if (!winningBet) throw new Error('Algo deu errado.');
    const { avatar } = winningBet.userInfo;

    this.order.splice(91, 1, avatar);
    return this.order;
  }
}

export default RenderAvatars;
