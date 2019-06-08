import { Action, State } from '../modules';
import { IAccount, IAccountDevice, IAccountFriendRecovery, IDevice } from '../interfaces';

export interface ISdkReduxState {
  initialized: boolean;
  connected: boolean;
  authenticated: boolean;
  account: IAccount;
  accountDevice: IAccountDevice;
  accountFriendRecovery: IAccountFriendRecovery;
  device: IDevice;
  ens: State.IEns;
  eth: State.IEth;
  incomingAction: Action.IAction;
}
