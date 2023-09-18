export default interface IFirebaseQueryResponse<T> {
  docId: string;
  body: T;
}
