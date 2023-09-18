import { IJWTPayload } from './IJWT';
import { IJackpotBetPayload } from './IPayloads';

export interface IBetControllerGQL {
  makeBetOnJackpot(
    userInfo: IJWTPayload,
    payload: IJackpotBetPayload,
  ): Promise<void>;
}

export interface IBetRedisCreate {
  userInfo: IJWTPayload;
  intervals?: number[];
  amountBet: number;
  gameId: string;
  createdAt: number;
}

export interface IBetDBCreate {
  amountBet: number;
  amountReceived: number;
  createdAt: number;
  gameId: string;
  intervals: number[];
  userRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
}

// Difference between this and 'IBetRedisCreate' is that this one has docId (since it was created later)
export interface IBetRedis {
  docId: string;
  intervals: number[];
  amountBet: number;
  createdAt: number;
  gameId: string;
  userInfo: IJWTPayload;
}
