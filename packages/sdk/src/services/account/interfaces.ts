import { TUniqueBehaviorSubject } from 'rxjs-addons';
import { IBN } from 'bn.js';
import { IDevice } from '../device';
import { ILinkingService } from '../linking';
import { IPlatformService } from '../platform';
import {
  AccountDeviceStates,
  AccountDeviceTypes,
  AccountStates,
  AccountDeployModes, AccountTransactionTypes,
} from './constants';

export interface IAccountService extends IPlatformService {
  readonly account$: TUniqueBehaviorSubject<IAccount>;
  readonly account: IAccount;
  readonly accountBalance$: TUniqueBehaviorSubject<IBN>;
  readonly accountBalance: IBN;
  readonly accountDevice$: TUniqueBehaviorSubject<IAccountDevice>;
  readonly accountDevice: IAccountDevice;

  setup(): Promise<void>;

  reset(): void;

  connectAccount(accountAddress: string): Promise<ILinkingService.TUrlCreator>;

  getAccounts(): Promise<IAccount[]>;

  getAccountDevice(): Promise<IAccountDevice[]>;

  getAccountTransactions(): Promise<IAccountTransaction[]>;

  requestAddAccountDevice(accountAddress?: string): ILinkingService.TUrlCreator;

  createAccountDevice(deviceAddress: string): Promise<boolean>;

  removeAccountDevice(deviceAddress: string): Promise<boolean>;

  disconnectAccountDevice(): Promise<boolean>;

  fetchAccount(): Promise<void>;

  fetchAccountDevice(): Promise<void>;

  lookupAccountAddress(ensName: string): Promise<string>;
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
  device: IDevice;
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

export namespace IAccountLinkingActions {
  export enum Types {
    AddAccountDeviceRequest = 'AddAccountDeviceRequest',
  }

  export interface IAddAccountDeviceRequestPayload {
    accountAddress: string;
    deviceAddress: string;
  }
}
