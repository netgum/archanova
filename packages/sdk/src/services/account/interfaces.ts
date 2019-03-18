import { IBN } from 'bn.js';
import {
  AccountDeviceStates,
  AccountDeviceTypes,
  AccountStates,
  AccountDeployModes, AccountTransactionTypes,
} from './constants';

export interface IAccountService {
  getAccountAddressByEnsName(ensName: string): Promise<string>;

  getAccounts(): Promise<IAccount[]>;

  getAccount(accountAddress: string): Promise<IAccount>;

  getAccountDevices(accountAddress: string): Promise<IAccountDevice[]>;

  getAccountTransactions(accountAddress: string): Promise<IAccountTransaction[]>;

  getAccountDevice(accountAddress: string, deviceAddress: string): Promise<IAccountDevice>;

  createAccountDevice(accountAddress: string, deviceAddress: string): Promise<IAccountDevice>;

  removeAccountDevice(accountAddress: string, deviceAddress: string): Promise<boolean>;
}

export interface IAccount {
  id: number;
  ensName: string;
  address: string;
  state: AccountStates;
  nextState: AccountStates;
  deployMode: AccountDeployModes;
  updatedAt: any;
}

export interface IAccountDevice {
  deviceAddress: string;
  type: AccountDeviceTypes;
  state: AccountDeviceStates;
  nextState: AccountDeviceStates;
  updatedAt: any;
}

export interface IAccountTransaction {
  hash: string;
  address: string;
  type: AccountTransactionTypes;
  value: IBN;
  updatedAt: any;
}
