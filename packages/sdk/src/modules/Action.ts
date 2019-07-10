import { Subscription } from 'rxjs';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { filter, tap } from 'rxjs/operators';

export class Action {
  public static createAction<T = any>(type: Action.Types, payload: T): Action.IAction<T> {
    return {
      type,
      payload,
      timestamp: Date.now(),
    };
  }

  public $incoming = new UniqueBehaviorSubject<Action.IAction>(null);
  public $accepted = new UniqueBehaviorSubject<Action.IAction>(null);

  constructor(private options: Action.IOptions) {
    //
  }

  public setup(): Subscription {
    return this.options && this.options.autoAccept
      ? this
        .$incoming
        .pipe(
          filter(action => !!action),
          tap(() => this.acceptAction()),
        )
        .subscribe()
      : null;
  }

  public acceptAction(action: Action.IAction = null): void {
    if (!action) {
      action = this.$incoming.value;
      if (action) {
        this.$incoming.next(null);
      }
    }

    if (action) {
      this.$accepted.next(action);
    }
  }

  public dismissAction(): void {
    this.$incoming.next(null);
    this.$accepted.next(null);
  }
}

export namespace Action {
  export interface IOptions {
    autoAccept?: boolean;
  }

  export enum Types {
    RequestAddAccountDevice = 'RequestAddAccountDevice',
    AccountDeviceAdded = 'AccountDeviceAdded',
    RequestSignSecureCode = 'RequestSignSecureCode',
  }

  export interface IAction<T = any> {
    type: Types;
    payload: T;
    timestamp: number;
  }

  export interface IRequestAddAccountDevicePayload {
    account?: string;
    device: string;
    callbackEndpoint?: string;
  }

  export interface IAccountDeviceAddedPayload {
    account: string;
  }

  export interface IRequestSignSecureCodePayload {
    code: string;
    creator: string;
  }
}
