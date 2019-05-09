import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Api } from './Api';

export class Event {
  constructor(private api: Api) {
    //
  }

  public ofName(name: Event.Names = null): Observable<Event.IEvent['payload']> {
    return this
      .api
      .message$
      .pipe(
        filter(event => !name || event.name === name),
        map(({ payload }) => payload),
      );
  }
}

export namespace Event {
  export enum Names {
    AccountUpdated = 'AccountUpdated',
    AccountDeviceUpdated = 'AccountDeviceUpdated',
    AccountDeviceRemoved = 'AccountDeviceRemoved',
    AccountTransactionUpdated = 'AccountTransactionUpdated',
    AccountGameUpdated = 'AccountGameUpdated',
    SecureCodeSigned = 'SecureCodeSigned',
  }

  export interface IEvent {
    name: Names;
    payload: {
      account?: string;
      device?: string;
      hash?: string;
      game?: number;
      code?: string;
    };
  }
}
