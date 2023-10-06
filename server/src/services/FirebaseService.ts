// Otimizar tipagem (Priority: **)
import * as admin from 'firebase-admin';

import IFirebaseQueryResponse, {
  TDBCollections,
} from '../config/interfaces/IFirebase';
import {
  DocumentNotFoundError,
  UnexpectedDatabaseError,
} from '../config/errors/classes/SystemErrors';

class FirebaseService {
  public firestore: FirebaseFirestore.Firestore;

  constructor(credentials: admin.ServiceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(credentials) });
    this.firestore = admin.firestore();
  }

  async writeDocument<T extends admin.firestore.DocumentData>(
    collection: TDBCollections,
    payload: T,
  ): Promise<string> {
    try {
      const docRef = await this.firestore.collection(collection).add(payload);
      return docRef.id;
    } catch (err: any) {
      throw new UnexpectedDatabaseError(err);
    }
  }

  // Specific query (if the document doesn't exists, it throws an error)
  async updateDocument<T>(
    collection: TDBCollections,
    docId: string,
    payload: any,
  ): Promise<IFirebaseQueryResponse<T>> {
    try {
      const docRef = await this.firestore.collection(collection).doc(docId);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) throw new DocumentNotFoundError();

      const docData = docSnapshot.data();
      await docRef.update(payload);
      return { docId, body: { ...docData, ...payload } as T };
    } catch (err: any) {
      throw new UnexpectedDatabaseError(err);
    }
  }

  // Specific query (if the document doesn't exists, it throws an error)
  async getDocumentRef(collection: TDBCollections, docId: string) {
    try {
      const docRef = this.firestore.collection(collection).doc(docId);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) throw new DocumentNotFoundError();
      return docRef;
    } catch (err: any) {
      throw new UnexpectedDatabaseError(err);
    }
  }

  // Specific query (if the document doesn't exists, it throws an error)
  async getDocumentById<T>(
    collection: TDBCollections,
    docId: string,
  ): Promise<IFirebaseQueryResponse<T> | null> {
    try {
      const docRef = this.firestore.collection(collection).doc(docId);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) throw new DocumentNotFoundError();

      const docData = docSnapshot.data();
      return { docId, body: { ...docData } as T };
    } catch (err: any) {
      throw new UnexpectedDatabaseError(err);
    }
  }

  // Specific query (if the document doesn't exists, it throws an error)
  async getSingleDocumentByParam<T>(
    collection: TDBCollections,
    param: string,
    paramValue: string,
  ): Promise<IFirebaseQueryResponse<T> | null> {
    try {
      const docRef = await this.firestore
        .collection(collection)
        .where(param, '==', paramValue)
        .limit(1);
      const docSnapshot = await docRef.get();

      if (docSnapshot.empty) throw new DocumentNotFoundError();

      const docId = docSnapshot.docs[0].id;
      const docSnapshotData = docSnapshot.docs[0].data();
      return {
        docId: docId as string,
        body: { ...docSnapshotData } as T,
      };
    } catch (err: any) {
      throw new UnexpectedDatabaseError(err);
    }
  }

  async getManyDocumentsByParam<T>(
    collection: TDBCollections,
    param: string,
    paramValue: string | any,
  ): Promise<IFirebaseQueryResponse<T>[] | null> {
    try {
      const docRef = await this.firestore
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
    } catch (err: any) {
      throw new UnexpectedDatabaseError(err);
    }
  }
}

export default FirebaseService;
