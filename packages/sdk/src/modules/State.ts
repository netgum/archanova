import { UniqueBehaviorSubject, TUniqueBehaviorSubject } from 'rxjs-addons';
import { from, Subscription } from 'rxjs';
import { skip, switchMap, map } from 'rxjs/operators';
import { Action } from './Action';
import { Storage } from './Storage';
import { IAccount, IAccountDevice, IAccountFriendRecovery, IDevice } from '../interfaces';

export class State {
  public initialized$ = new UniqueBehaviorSubject<boolean>();
  public connected$ = new UniqueBehaviorSubject<boolean>();
  public authenticated$ = new UniqueBehaviorSubject<boolean>();
  public account$ = new UniqueBehaviorSubject<IAccount>(null, {
    prepare: (newValue, oldValue) => {
      if (
        newValue &&
        oldValue &&
        !newValue.balance.real &&
        oldValue.balance.real
      ) {
        newValue.balance.real = oldValue.balance.real;
      }

      return newValue;
    },
  });
  public accountDevice$ = new UniqueBehaviorSubject<IAccountDevice>();
  public accountFriendRecovery$ = new UniqueBehaviorSubject<IAccountFriendRecovery>();
  public device$ = new UniqueBehaviorSubject<IDevice>();
  public ens$ = new UniqueBehaviorSubject<State.IEns>();
  public eth$ = new UniqueBehaviorSubject<State.IEth>();
  public session$ = new UniqueBehaviorSubject<State.ISession>();
  public incomingAction$ = new UniqueBehaviorSubject<Action.IAction>();

  constructor() {
    //
  }

  public get initialized(): boolean {
    return this.initialized$.value;
  }

  public get connected(): boolean {
    return this.connected$.value;
  }

  public get authenticated(): boolean {
    return this.authenticated$.value;
  }

  public get account(): IAccount {
    return this.account$.value;
  }

  public get accountAddress(): string {
    const { value } = this.account$;
    return value
      ? value.address
      : null;
  }

  public get accountDevice(): IAccountDevice {
    return this.accountDevice$.value;
  }

  public get accountFriendRecovery(): IAccountFriendRecovery {
    return this.accountFriendRecovery$.value;
  }

  public get device(): IDevice {
    return this.device$.value;
  }

  public get deviceAddress(): string {
    const { value } = this.device$;
    return value
      ? value.address
      : null;
  }

  public get ens(): State.IEns {
    return this.ens$.value;
  }

  public get eth(): State.IEth {
    return this.eth$.value;
  }

  public get session(): State.ISession {
    return this.session$.value;
  }

  public get sessionToken(): string {
    const { value } = this.session$;
    return value
      ? value.token
      : null;
  }

  public get incomingAction(): Action.IAction {
    return this.incomingAction$.value;
  }

  public setup(storage: Storage): Promise<Subscription[]> {
    return Promise.all([
      Promise.resolve(
        this
          .session$
          .pipe(
            map(session => !!session),
          )
          .subscribe(this.authenticated$),
      ),
      this.attachToStorage(storage, this.account$, State.StorageKeys.Account),
      this.attachToStorage(storage, this.accountDevice$, State.StorageKeys.AccountDevice),
      this.attachToStorage(storage, this.accountFriendRecovery$, State.StorageKeys.AccountFriendRecovery),
    ]);
  }

  public reset(): void {
    this.initialized$.next(null);
    this.connected$.next(null);
    this.authenticated$.next(null);
    this.account$.next(null);
    this.accountDevice$.next(null);
    this.accountFriendRecovery$.next(null);
    this.device$.next(null);
    this.ens$.next(null);
    this.eth$.next(null);
    this.session$.next(null);
    this.incomingAction$.next(null);
  }

  private async attachToStorage(storage: Storage, subject: TUniqueBehaviorSubject, key: State.StorageKeys): Promise<Subscription> {
    const value = await storage.getItem(key);
    if (value) {
      subject.next(value);
    }

    return subject
      .pipe(
        skip(1),
        switchMap(value =>
          from(storage.setItem(key, value).catch(() => null)),
        ),
      )
      .subscribe();
  }
}

export namespace State {
  export enum StorageKeys {
    Account = 'account',
    AccountDevice = 'account_device',
    AccountFriendRecovery = 'account_friend_recovery',
  }

  export interface IEns {
    supportedRoots: {
      name: string;
      nameHash: string;
    }[];
  }

  export interface IEth {
    networkId: string;
    networkName: string;
  }

  export interface ISession {
    token: string;
  }
}
