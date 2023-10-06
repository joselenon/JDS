import * as admin from 'firebase-admin';

import {
  CodeAlreadyUsed,
  CodeNotFound,
  CodeUsageLimitError,
} from '../config/errors/classes/ClientErrors';
import {
  ICreateTransactionPayload,
  IRedeemCodePayload,
} from '../config/interfaces/IPayloads';
import { InvalidPayloadError } from '../config/errors/classes/SystemErrors';
import ICode from '../config/interfaces/ICode';
import IFirebaseQueryResponse from '../config/interfaces/IFirebase';

import BalanceService from './BalanceService';
import { FirebaseInstance } from '..';

class DepositService {
  private async validateCodeUsage(code: string, userDocId: string) {
    const codeInfo = await FirebaseInstance.getSingleDocumentByParam<ICode>(
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
    const userRef = await FirebaseInstance.getDocumentRef('users', userDocId);
    const payload = {
      claims: admin.firestore.FieldValue.arrayUnion(userRef),
    };
    await FirebaseInstance.updateDocument('codes', codeDocId, payload);
  }

  async createNewTransaction(userDocId: string, codeValue: number) {
    const userRef = await FirebaseInstance.getDocumentRef('users', userDocId);
    const transactionFullPayload: ICreateTransactionPayload = {
      method: 'code',
      type: 'deposit',
      userRef: userRef,
      value: codeValue,
      createdAt: Date.now(),
    };
    await FirebaseInstance.writeDocument<ICreateTransactionPayload>(
      'transactions',
      transactionFullPayload,
    );
  }

  async redeemCode(userDocId: string, payload: IRedeemCodePayload) {
    if (!payload.code) throw new InvalidPayloadError();

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
