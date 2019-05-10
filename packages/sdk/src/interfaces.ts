import BN from 'bn.js';
import {
  AccountStates,
  AccountTypes,
  AccountDeviceStates,
  AccountDeviceTypes,
  AccountGameStates,
  AccountGamePlayers,
  AccountTransactionTypes,
  AppStates,
} from './constants';

export interface IAccount {
  address: string;
  ensName?: string;
  type: AccountTypes;
  state: AccountStates;
  nextState?: AccountStates;
  virtualBalance: BN;
  updatedAt: Date;
}

export interface IAccountDevice {
  device: IDevice;
  type: AccountDeviceTypes;
  state: AccountDeviceStates;
  nextState: AccountDeviceStates;
  updatedAt: Date;
}

export interface IAccountGameHistory {
  player: IAccount;
  stateValue: string;
  updatedAt: Date;
}

export interface IAccountGame {
  id: number;
  app: IApp;
  creator: IAccount;
  opponent: IAccount;
  state: AccountGameStates;
  stateValue: string;
  creatorSignature: Buffer;
  opponentSignature: Buffer;
  guardianSignature: Buffer;
  whoseTurn: AccountGamePlayers;
  winner: AccountGamePlayers;
  deposit: BN;
  updatedAt: Date;
}

export interface IAccountTransaction {
  type: AccountTransactionTypes;
  address: string;
  hash: string;
  value: BN;
  fee: BN;
  updatedAt: Date;
}

export interface IApp {
  creator: IAccount;
  state: AppStates;
  alias: string;
  name: string;
  description: string;
  imageUrl: string;
  updatedAt: string;
}

export interface IDevice {
  address: string;
}

export interface IPaginated<T = any> {
  items: T[];
  currentPage: number;
  nextPage: number;
}
