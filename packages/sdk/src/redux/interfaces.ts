import { IBN } from 'bn.js';
import {
  IAccount,
  IAccountDevice,
  IAction,
} from '../services';

export interface IReduxState {
  account: IAccount;
  accountBalance: IBN;
  accountDevice: IAccountDevice;
  deviceAddress: string;
  gasPrice: IBN;
  networkVersion: string;
  initialized: boolean;
  authenticated: boolean;
  connected: boolean;
  incomingAction: IAction;
}
