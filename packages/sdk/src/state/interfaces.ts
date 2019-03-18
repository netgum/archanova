import { IBN } from 'bn.js';
import { Subject } from 'rxjs';
import { IAccount, IAccountDevice } from '../services';

export interface IState {
  readonly error$: Subject<any>;
  readonly account$: Subject<IAccount>;
  readonly accountDevice$: Subject<IAccountDevice>;
  readonly accountBalance$: Subject<IBN>;
  readonly deviceAddress$: Subject<string>;
  readonly gasPrice$: Subject<IBN>;
  readonly networkVersion$: Subject<string>;
  readonly initialized$: Subject<boolean>;
  readonly authenticated$: Subject<boolean>;
  readonly connected$: Subject<boolean>;

  readonly account: IAccount;
  readonly accountAddress: string;
  readonly accountDevice: IAccountDevice;
  readonly accountBalance: IBN;
  readonly deviceAddress: string;
  readonly gasPrice: IBN;
  readonly networkVersion: string;
  readonly initialized: boolean;
  readonly authenticated: boolean;
  readonly connected: boolean;

  setup(): Promise<void>;

  reset(): void;
}
