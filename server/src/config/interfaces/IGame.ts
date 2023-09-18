import * as admin from 'firebase-admin';

import { GameModeProtocol, GameStatusProtocol } from '../gameLogic/config';
import { IBetRedis } from './IBet';

export interface IGameDB {
  bets: IBetRedis[];
  type: GameModeProtocol;
  ticketDrawn?: { ticket: number; hash: any };
  winningBetRef?: admin.firestore.DocumentReference<admin.firestore.DocumentData>;
  prizePool: number;
  status: GameStatusProtocol;
  createdAt: number;
  startedAt?: number;
  updatedAt?: number;
  finishedAt?: number;
}

export interface IGameRedis {
  docId: string;
  bets: IBetRedis[];
  type: GameModeProtocol;
  ticketDrawn?: { ticket: number; hash: any };
  winningBetRef?: IBetRedis;
  prizePool: number;
  status: GameStatusProtocol;
  createdAt: number;
  startedAt?: number;
  updatedAt?: number;
  finishedAt?: number;
}

export interface IGameRedisUpdate {
  docId?: string;
  bets?: IBetRedis[];
  type?: GameModeProtocol;
  ticketDrawn?: { ticket: number; hash: any };
  winningBetRef?: IBetRedis;
  prizePool?: number;
  status?: GameStatusProtocol;
  createdAt?: number;
  startedAt?: number;
  updatedAt?: number;
  finishedAt?: number;
}

export interface IGameDBUpdate {
  bets?: admin.firestore.FieldValue;
  type?: GameModeProtocol;
  ticketDrawn?: { ticket: number; hash: any };
  winningBetRef?: admin.firestore.DocumentReference<admin.firestore.DocumentData>;
  prizePool?: number;
  status?: GameStatusProtocol;
  createdAt?: number;
  startedAt?: number;
  updatedAt?: number;
  finishedAt?: number;
}
