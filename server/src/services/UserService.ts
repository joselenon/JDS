import FirebaseService, { firestore } from './FirebaseService';
import IUser from '../config/interfaces/IUser';
import { ISteamProfile } from '../config/interfaces/ISteamProfile';
import ITransaction from '../config/interfaces/ITransaction';
import { AuthError } from '../config/errorTypes/ClientErrors';
import RedisService from './RedisService';
import redisHelper from '../helpers/redisHelper';
import { validUpdateUserPayload } from '../helpers/payloadHelper';
import { IJWTPayload } from '../config/interfaces/IJWT';

export default class UserService {
  static async createUserThroughSteam(
    steamPayload: ISteamProfile,
  ): Promise<IJWTPayload> {
    const { steamid, personaname, avatarfull } = steamPayload;
    const userDocId = await FirebaseService.writeDocument('users', {
      username: personaname,
      steamid: steamid,
      avatar: avatarfull,
      balance: 0,
      tradeLink: '',
      email: '',
    });
    const userExists = await FirebaseService.getSingleDocumentByParam<IUser>(
      'users',
      'steamid',
      steamid,
    );
    console.log(userExists);
    if (userExists) {
      const { avatar, username } = userExists.body;
      return { avatar, userDocId, username };
    }
    throw new Error('1');
  }

  static async updateInfo(
    userDocId: string,
    payload: any,
  ): Promise<IJWTPayload> {
    const filteredPayload = validUpdateUserPayload(payload);
    const docUpdated = await FirebaseService.updateDocument<
      {
        email?: string;
        tradeLink: string;
      },
      IUser
    >('users', userDocId, filteredPayload);
    const { avatar, username } = docUpdated.body;
    return { avatar, username, userDocId };
  }

  static async setBalanceInCache(
    userDocId: string,
    balanceObj: { balance: number },
  ) {
    const cacheKey = redisHelper('last_balance_att', userDocId);
    await RedisService.set(cacheKey, balanceObj, { inJSON: true });
  }

  // Runs when: balance is not in stored in cache, before every other request that need balance info (withdraw, bets...)
  static async calculateBalance(userDocId: string) {
    const userRef = firestore.collection('users').doc(userDocId);
    if (!userRef) throw new AuthError();
    const transactions =
      await FirebaseService.getManyDocumentsByParam<ITransaction | null>(
        'transactions',
        'userId',
        userRef,
      );
    if (!transactions) return { balance: 0 };

    const balanceCalc = transactions.reduce((acc, transaction) => {
      switch (transaction.body?.type) {
        case 'deposit':
          acc += transaction.body.value;
          break;
        case 'withdraw':
          acc -= transaction.body.value;
          break;
      }
      return acc;
    }, 0);

    const balanceObj = { balance: balanceCalc };
    await FirebaseService.updateDocument('users', userDocId, balanceObj);
    await UserService.setBalanceInCache(userDocId, balanceObj);
    return balanceObj;
  }

  // Function to display the balance (not trustable since if there's any value in cache, it will delivery it)
  static async getBalanceFromCache(
    userDocId: string,
  ): Promise<{ balance: number }> {
    const cacheKey = redisHelper('last_balance_att', userDocId);
    // To be fixed (any)
    const balance: any = await RedisService.get<{ balance: number }>(cacheKey, {
      inJSON: true,
    });
    console.log('aqui esta a balance do cache', balance);
    if (!balance) {
      return await UserService.calculateBalance(userDocId);
    }
    return balance;
  }
}
