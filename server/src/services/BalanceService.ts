import FirebaseService, { firestore } from './FirebaseService';
import { AuthError } from '../config/errorTypes/ClientErrors';
import { IBetDBCreate } from '../config/interfaces/IBet';
import ITransaction from '../config/interfaces/ITransaction';

import getRedisKeyHelper from '../helpers/redisHelper';
import RedisService from './RedisService';
import pSubEventHelper from '../helpers/pSubEventHelper';

class BalanceService {
  static async calculateTransactions(
    userRef: FirebaseFirestore.DocumentReference,
  ) {
    const userTransactions =
      await FirebaseService.getManyDocumentsByParam<ITransaction>(
        'transactions',
        'userRef',
        userRef,
      );
    if (!userTransactions) return 0;
    const calc = userTransactions.reduce((acc, transaction) => {
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
    if (calc === null || calc === undefined) {
      throw new Error('algo deu errado aqui');
    }
    return calc;
  }

  static async calculateBets(userRef: FirebaseFirestore.DocumentReference) {
    const userBets =
      await FirebaseService.getManyDocumentsByParam<IBetDBCreate>(
        'bets',
        'userRef',
        userRef,
      );

    if (!userBets || userBets.length <= 0) return 0;
    const calc = userBets.reduce((acc, bet) => {
      const amountBet = bet.body.amountBet;
      const amountReceived = bet.body.amountReceived;
      return (acc += amountReceived - amountBet);
    }, 0);

    if (calc === null || calc === undefined) {
      throw new Error('algo deu errado aca');
    }
    return calc;
  }

  // Recalculate all the transactions and bets in order to update the balance (DB, Cache, Client???)
  static async hardUpdateBalances(userDocId: string) {
    try {
      const userRef = firestore.collection('users').doc(userDocId);
      if (!userRef) throw new AuthError();
      const balanceCalc =
        (await BalanceService.calculateTransactions(userRef)) +
        (await BalanceService.calculateBets(userRef));
      const balanceObj = { balance: balanceCalc };

      // DB Update
      await FirebaseService.updateDocument('users', userDocId, balanceObj);
      // Cache Update
      const cacheKey = getRedisKeyHelper('last_balance_att', userDocId);
      await RedisService.set(cacheKey, balanceObj, { inJSON: true });

      return balanceObj;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // Do not recalculate all the transaction, only adds a value received to the in cache saved balance (Cache, Client)
  static async softUpdateBalances(userDocId: string, valueToAdd: number) {
    const { balance } = await BalanceService.getBalance(userDocId);
    const newBalance = { balance: balance + valueToAdd };

    // Client update
    pSubEventHelper(
      'GET_LIVE_BALANCE',
      'getLiveBalance',
      newBalance,
      userDocId,
    );
    // Cache update
    const cacheKey = getRedisKeyHelper('last_balance_att', userDocId);
    await RedisService.set(cacheKey, newBalance, { inJSON: true });
  }

  // Function to display the balance (not trustable since if there's any value in cache, it will delivery it)
  static async getBalance(userDocId: string): Promise<{ balance: number }> {
    const cacheKey = getRedisKeyHelper('last_balance_att', userDocId);
    const balance = await RedisService.get<{ balance: number }>(cacheKey, {
      inJSON: true,
    });
    if (!balance) {
      return await BalanceService.hardUpdateBalances(userDocId);
    }
    return balance;
  }
}

export default BalanceService;
