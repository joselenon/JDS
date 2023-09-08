import * as admin from 'firebase-admin';

import {
  CodeAlreadyUsed,
  CodeNotFound,
  CodeUsageLimitError,
} from '../config/errorTypes/ClientErrors';
import {
  ICreateTransactionPayload,
  IRedeemCodePayload,
} from '../config/interfaces/IPayloads';
import ICode from '../config/interfaces/ICode';
import FirebaseService, { firestore } from './FirebaseService';
import UserService from './UserService';
import IFirebaseQueryResponse from '../config/interfaces/IFirebaseQueryResponse';
import { InvalidPayload } from '../config/errorTypes/SystemErrors';
import pSubEventHelper from '../helpers/pSubEventHelper';

class DepositService {
  private async validateCodeUsage(code: string, userDocId: string) {
    const codeInfo = await FirebaseService.getSingleDocumentByParam<ICode>(
      'codes',
      'name',
      code,
    );
    if (!codeInfo) throw new CodeNotFound();
    const { nUsers, claims, value } = codeInfo.body;
    if (claims.length >= nUsers) throw new CodeUsageLimitError();
    const userAlreadyClaimed = claims.some(
      (claimRef) => userDocId === claimRef.id,
    );
    if (userAlreadyClaimed) throw new CodeAlreadyUsed();
    return { codeInfo, value };
  }

  async updateCodeInDB(
    userDocId: string,
    codeInfo: IFirebaseQueryResponse<ICode>,
  ) {
    const { docId: codeDocId } = codeInfo;
    const userCollection = firestore.collection('users');
    const userReference = userCollection.doc(userDocId);
    const payload = {
      claims: admin.firestore.FieldValue.arrayUnion(userReference),
    };
    FirebaseService.updateDocument('codes', codeDocId, payload);
  }

  async createNewTransaction(userDocId: string, codeValue: number) {
    const userCollection = firestore.collection('users');
    const userReference = userCollection.doc(userDocId);
    const transactionFullPayload: ICreateTransactionPayload = {
      method: 'code',
      type: 'deposit',
      userRef: userReference,
      value: codeValue,
      createdAt: Date.now(),
    };
    await FirebaseService.writeDocument<ICreateTransactionPayload>(
      'transactions',
      transactionFullPayload,
    );
  }

  // Updates balance on cache (Redis) and client (PSub)
  async updateBalances(userDocId: string, codeValue: number) {
    const { balance } = await UserService.getBalanceFromCache(userDocId);
    const newBalance = { balance: balance + codeValue };
    pSubEventHelper(
      'GET_LIVE_BALANCE',
      'getLiveBalance',
      newBalance,
      userDocId,
    );
    await UserService.setBalanceInCache(userDocId, newBalance);
  }

  async redeemCode(userDocId: string, payload: IRedeemCodePayload) {
    if (!payload.code) throw new InvalidPayload();

    const { code } = payload;
    const { codeInfo, value: codeValue } = await this.validateCodeUsage(
      code,
      userDocId,
    );

    // Update code info in DB
    await this.updateCodeInDB(userDocId, codeInfo);

    // Create new transaction in DB
    await this.createNewTransaction(userDocId, codeValue);

    // Update balance on display and cache (not trustable)
    await this.updateBalances(userDocId, codeValue);
  }
}

export default new DepositService();
