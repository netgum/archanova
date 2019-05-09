import BN from 'bn.js';
import { Action, State } from '../modules';
import { IAccount, IAccountDevice, IDevice } from '../interfaces';

export interface ISdkReduxState {
  initialized: boolean;
  connected: boolean;
  authenticated: boolean;
  account: IAccount;
  accountDevice: IAccountDevice;
  accountBalance: BN;
  device: IDevice;
  ens: State.IEns;
  eth: State.IEth;
  incomingAction: Action.IAction;
}
