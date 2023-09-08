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

  static async updateDocument<T extends { [x: string]: any }, Q>(
    collection: TDBCollections,
    docId: string,
    payload: T,
  ): Promise<IFirebaseQueryResponse<Q>> {
    const docRef = await firestore.collection(collection).doc(docId);
    const docSnapshotData = (await docRef.get()).data();
    if (!docSnapshotData) throw new DocumentNotFound();
    await docRef.update(payload);
    return { docId, body: { ...docSnapshotData, ...payload } as Q };
  }

  static async getDocumentRef(collection: TDBCollections, docId: string) {
    const docRef = firestore.collection(collection).doc(docId);
    return docRef;
  }

  static async getDocumentById<T>(
    collection: TDBCollections,
    docId: string,
  ): Promise<IFirebaseQueryResponse<T> | null> {
    const docRef = firestore.collection(collection).doc(docId);
    const docSnapshotData = (await docRef.get()).data();
    if (!docSnapshotData) return null;
    return { docId, body: { ...docSnapshotData } as T };
  }

  // Return an obj with docId and data of a single document depending on the param passed
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

    if (docSnapshot.empty) {
      return null;
    }

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
