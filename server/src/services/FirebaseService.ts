// Otimizar tipagem (Priority: **)
import * as admin from 'firebase-admin';
import FirebaseServiceAccountConfig from '../config/app/FirebaseServiceAccountConfig';

import IFirebaseQueryResponse from '../config/interfaces/IFirebaseQueryResponse';
import { DocumentNotFound } from '../config/errorTypes/SystemErrors';

admin.initializeApp({
  credential: admin.credential.cert(FirebaseServiceAccountConfig),
});
export const firestore: FirebaseFirestore.Firestore = admin.firestore();

type TDBCollections = 'bets' | 'codes' | 'games' | 'transactions' | 'users';

export default class FirebaseService {
  static async writeDocument<T extends admin.firestore.DocumentData>(
    collection: TDBCollections,
    payload: T,
  ): Promise<string> {
    const docRef = await firestore.collection(collection).add(payload);
    return docRef.id;
  }

  // Specific query (if the document doesn't exists, it throws an error)
  static async updateDocument<T>(
    collection: TDBCollections,
    docId: string,
    payload: any,
  ): Promise<IFirebaseQueryResponse<T>> {
    const docRef = await firestore.collection(collection).doc(docId);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) throw new DocumentNotFound();

    const docData = docSnapshot.data();
    await docRef.update(payload);
    return { docId, body: { ...docData, ...payload } as T };
  }

  // Specific query (if the document doesn't exists, it throws an error)
  static async getDocumentRef(collection: TDBCollections, docId: string) {
    const docRef = firestore.collection(collection).doc(docId);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) throw new DocumentNotFound();
    return docRef;
  }

  // Specific query (if the document doesn't exists, it throws an error)
  static async getDocumentById<T>(
    collection: TDBCollections,
    docId: string,
  ): Promise<IFirebaseQueryResponse<T> | null> {
    const docRef = firestore.collection(collection).doc(docId);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) throw new DocumentNotFound();

    const docData = docSnapshot.data();
    return { docId, body: { ...docData } as T };
  }

  // Specific query (if the document doesn't exists, it throws an error)
  static async getSingleDocumentByParam<T>(
    collection: TDBCollections,
    param: string,
    paramValue: string,
  ): Promise<IFirebaseQueryResponse<T> | null> {
    const docRef = await firestore
      .collection(collection)
      .where(param, '==', paramValue)
      .limit(1);
    const docSnapshot = await docRef.get();

    if (docSnapshot.empty) throw new DocumentNotFound();

    const docId = docSnapshot.docs[0].id;
    const docSnapshotData = docSnapshot.docs[0].data();
    return {
      docId: docId as string,
      body: { ...docSnapshotData } as T,
    };
  }

  static async getManyDocumentsByParam<T>(
    collection: TDBCollections,
    param: string,
    paramValue: string | any,
  ): Promise<IFirebaseQueryResponse<T>[] | null> {
    const docRef = await firestore
      .collection(collection)
      .where(param, '==', paramValue);
    const docSnapshot = (await docRef.get()).docs;

    const docsDataPromise = docSnapshot.map(async (doc) => {
      const docData = doc.data() as T;
      const obj: IFirebaseQueryResponse<T> = {
        docId: doc.id,
        body: docData,
      };
      return obj;
    });

    const docsData = await Promise.all(docsDataPromise);
    return docsData;
  }
}
