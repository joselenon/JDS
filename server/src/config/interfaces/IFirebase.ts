export default interface IFirebaseQueryResponse<T> {
  docId: string;
  body: T;
}

// Custom (modify when needed)
export type TDBCollections =
  | 'bets'
  | 'codes'
  | 'games'
  | 'transactions'
  | 'users';
