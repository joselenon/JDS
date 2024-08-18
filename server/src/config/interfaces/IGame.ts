import * as admin from 'firebase-admin';

import { GameModeProtocol, GameStatusProtocol } from '../logics/gameLogics';
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

export interface IGameInfo {
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

export interface IGameInfoUpdate {
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
