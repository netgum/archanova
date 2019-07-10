import 'cross-fetch/polyfill';

import { jsonReplacer, jsonReviver } from '@netgum/utils';
import { IProvider } from 'ethjs';
import { Subject, SubscriptionLike } from 'rxjs';
import { delay } from 'rxjs/operators';
import { State } from './State';

export class Api {
  private readonly wsEndpoint: string = null;
  private readonly httpEndpoint: string = null;

  constructor(
    private readonly options: Api.IOptions,
    private readonly webSocketConstructor: Api.IWebSocketConstructor = null,
    private readonly state: State,
  ) {
    const { host, port, ssl } = options;

    const endpointBase = `${ssl ? 's' : ''}://${host || 'localhost'}${port ? `:${port}` : ''}`;

    this.wsEndpoint = `ws${endpointBase}`;
    this.httpEndpoint = `http${endpointBase}`;

    if (
      !webSocketConstructor &&
      typeof WebSocket !== 'undefined'
    ) {
      this.webSocketConstructor = WebSocket;
    }
  }

  public toEthProvider(customError?: { new(err?: any): any }): IProvider {
    return {
      sendAsync: (body, callback) => {
        this
          .sendRequest({
            body,
            path: '',
            method: 'POST',
            dontUseReplacer: true,
          })
          .catch(err => callback(
            customError
              ? new customError(err)
              : err,
            null,
          ))
          .then(data => callback(null, data));
      },
    };
  }

  public get event$(): Subject<Api.IEvent> {
    const result = new Subject<any>();

    let disconnect: () => any = () => null;

    const subscriptions: SubscriptionLike[] = [];

    if (this.webSocketConstructor) {
      const { connected$, session$ } = this.state;
      const reconnected$ = new Subject<boolean>();

      let ws: WebSocket = null;

      const openHandler = () => connected$.next(true);
      const closeHandler = () => {
        connected$.next(false);
        reconnected$.next(true);
      };
      const errorHandler = () => ws.close();
      const messageHandler = ({ data }: WebSocketEventMap['message']) => {
        try {
          const message = JSON.parse(data, jsonReviver);
          if (message) {
            result.next(message);
          }
        } catch (err) {
          //
        }
      };

      const connect = () => {
        const { sessionToken } = this.state;
        if (!ws && sessionToken) {
          connected$.next(null);

          ws = new this.webSocketConstructor(`${this.wsEndpoint}?sessionToken=${sessionToken}`);
          ws.binaryType = 'blob';

          ws.addEventListener('open', openHandler);
          ws.addEventListener('close', closeHandler);
          ws.addEventListener('error', errorHandler);
          ws.addEventListener('message', messageHandler);
        }
      };

      disconnect = () => {
        if (ws) {
          connected$.next(false);

          ws.removeEventListener('open', openHandler);
          ws.removeEventListener('close', closeHandler);
          ws.removeEventListener('error', errorHandler);
          ws.removeEventListener('message', messageHandler);
          ws.close();
          ws = null;
        }
      };

      subscriptions.push(
        session$
          .subscribe(session => session ? connect() : disconnect()),
      );

      const { reconnectTimeout } = this.options;

      if (reconnectTimeout) {
        subscriptions.push(
          reconnected$
            .pipe(delay(reconnectTimeout))
            .subscribe(() => {
              disconnect();
              connect();
            }),
        );
      }
    }

    const complete = result.complete.bind(result);

    result.complete = () => {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
      disconnect();
      complete();
    };

    return result;
  }

  public async sendRequest<T = any, B = any>(req: Api.IRequest<B>): Promise<T> {
    const { method, path, body, dontUseReplacer } = req;

    let status: number = null;
    let data: T = null;

    try {
      const options: RequestInit = {
        method,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Session-Token': this.state.sessionToken || '',
          Pragma: 'no-cache',
        }),
        ...(
          method !== 'GET' &&
          method !== 'HEAD'
            ? { body: JSON.stringify(body || {}, dontUseReplacer ? undefined : jsonReplacer) }
            : {}
        ),
      };

      const res = await fetch(`${this.httpEndpoint}/${path || ''}`, options);

      ({ status } = res);
      data = JSON.parse(await res.text(), dontUseReplacer ? undefined : jsonReviver);
    } catch (err) {
      data = {} as any;
    }

    switch (status) {
      case 400:
        throw new Api.Error(Api.Error.Types.BadRequest, data);

      case 401:
        throw new Api.Error(Api.Error.Types.Unauthorized, data);

      case 403:
        throw new Api.Error(Api.Error.Types.Forbidden, data);

      case 404:
        throw new Api.Error(Api.Error.Types.NotFound, data);

      case 500:
      case null:
        throw new Api.Error(Api.Error.Types.Failed, data);
    }

    return data;
  }
}

export namespace Api {
  export interface IOptions {
    host?: string;
    port?: number;
    ssl?: boolean;
    reconnectTimeout?: number;
  }

  export interface IWebSocketConstructor {
    new(endpoint: string): any;
  }

  export interface IRequest<T = any> {
    method: string;
    path?: string;
    body?: T;
    dontUseReplacer?: boolean;
  }

  export class Error extends global.Error {
    public error: string = null;

    public errors: { [key: string]: string } = {};

    constructor(
      public type: Error.Types,
      response: {
        error?: string;
        errors?: {
          type: string;
          path: string;
        }[];
      } = null,
    ) {
      super(type);

      if (response) {
        if (response.error) {
          this.error = response.error;
        } else if (response.errors) {
          this.errors = response.errors.reduce(
            (result, error) => {
              return {
                ...result,
                [error.path]: error.type,
              };
            },
            {},
          );
        }
      }
    }
  }

  export enum EventNames {
    AccountUpdated = 'AccountUpdated',
    AccountVirtualBalanceUpdated = 'AccountVirtualBalanceUpdated',
    AccountDeviceUpdated = 'AccountDeviceUpdated',
    AccountDeviceRemoved = 'AccountDeviceRemoved',
    AccountFriendRecoveryUpdated = 'AccountFriendRecoveryUpdated',
    AccountTransactionUpdated = 'AccountTransactionUpdated',
    AccountPaymentUpdated = 'AccountPaymentUpdated',
    AccountGameUpdated = 'AccountGameUpdated',
    SecureCodeSigned = 'SecureCodeSigned',
  }

  export interface IEvent {
    name: EventNames;
    payload: Partial<{
      account: string;
      device: string;
      hash: string;
      game: number;
      index: number;
      token: string;
      code: string;
    }>;
  }

  export namespace Error {
    export enum Types {
      BadRequest = 'BadRequest',
      Unauthorized = 'Unauthorized',
      Forbidden = 'Forbidden',
      NotFound = 'NotFound',
      Failed = 'Failed',
    }
  }
}
