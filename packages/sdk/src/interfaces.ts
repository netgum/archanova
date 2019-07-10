import BN from 'bn.js';
import {
  AccountStates,
  AccountTypes,
  AccountDeviceStates,
  AccountDeviceTypes,
  AccountGameStates,
  AccountGamePlayers,
  AccountTransactionTypes,
  AccountTransactionStates,
  AccountPaymentStates,
  AppStates,
  TokenTypes,
} from './constants';

export interface IAccount {
  address: string;
  ensName: string;
  type: AccountTypes;
  state: AccountStates;
  nextState: AccountStates;
  balance: {
    real: BN;
    virtual: BN;
  };
  updatedAt: Date;
}

export interface IAccountDevice {
  device: IDevice;
  type: AccountDeviceTypes;
  state: AccountDeviceStates;
  nextState: AccountDeviceStates;
  updatedAt: Date;
}

export interface IAccountFriendRecovery {
  accountAddress: string;
  gasFee: BN;
  gasPrice: BN;
  nonce: BN;
  requiredFriends: BN;
  friends: string[];
  friendSignatures?: { [key: string]: string };
  updatedAt: Date;
}

export interface IAccountGameHistory {
  player: AccountGamePlayers;
  data: string;
  updatedAt: Date;
}

export interface IAccountGame {
  id: number;
  app: IApp;
  creator: {
    account: IAccount;
    payment: IAccountPayment;
  };
  opponent: {
    account: IAccount;
    payment: IAccountPayment;
  };
  state: AccountGameStates;
  data: string;
  whoseTurn: AccountGamePlayers;
  winner: AccountGamePlayers;
  deposit: {
    value: BN;
    token: IToken;
  };
  updatedAt: Date;
}

export interface IAccountTransaction {
  from: {
    account: IAccount;
    address: string;
  };
  to: {
    account: IAccount;
    address: string;
  };
  hash: string;
  type: AccountTransactionTypes;
  state: AccountTransactionStates;
  value: BN;
  fee: BN;
  gas: {
    used: BN;
    price: BN;
  };
  updatedAt: Date;
}

export interface IAccountPayment {
  sender: {
    account: IAccount;
    signature: Buffer;
  };
  recipient: {
    account: IAccount;
    address: string;
  };
  guardian: {
    signature: Buffer;
  };
  hash: string;
  state: AccountPaymentStates;
  value: BN;
  token: IToken;
  updatedAt: Date;
}

export interface IAccountVirtualBalance {
  token: IToken;
  value: BN;
  updatedAt: Date;
}

export interface IApp {
  creator: {
    account: IAccount;
  };
  state: AppStates;
  alias: string;
  name: string;
  description: string;
  imageUrl: string;
  updatedAt: Date;
}

export interface IDevice {
  address: string;
}

export interface IToken {
  symbol: string;
  name: string;
  type: TokenTypes;
  address: string;
  createdAt: Date;
}

export interface IEstimatedAccountDeployment {
  gasPrice?: BN;
  totalGas: BN;
  totalCost: BN;
}

export interface IEstimatedAccountProxyTransaction {
  nonce: BN;
  gasPrice?: BN;
  data?: string[];
  fixedGas: BN;
  totalGas: BN;
  totalCost: BN;
}

export interface IPaginated<T = any> {
  items: T[];
  currentPage: number;
  nextPage: number;
}
