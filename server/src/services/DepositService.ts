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
import { InvalidPayload } from '../config/errorTypes/SystemErrors';
import ICode from '../config/interfaces/ICode';
import IFirebaseQueryResponse from '../config/interfaces/IFirebaseQueryResponse';

import FirebaseService, { firestore } from './FirebaseService';
import BalanceService from './BalanceService';

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

    // ! Soft update (not trustable)
    await BalanceService.softUpdateBalances(userDocId, codeValue);
  }
}

export default new DepositService();
