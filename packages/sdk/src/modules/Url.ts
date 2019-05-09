import { jsonReplacer, jsonReviver } from '@netgum/utils';
import { Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { Action } from './Action';

export class Url {
  public static urlToAction(url: string): Action.IAction {
    let result: Action.IAction = null;

    if (url) {
      try {
        let [, raw] = url.split(`${this.QUERY_FIELD_NAME}=`);
        [raw] = raw.split('&');

        if (raw) {
          const action: Action.IAction = JSON.parse(decodeURIComponent(raw), jsonReviver);
          if (
            action.type &&
            action.payload &&
            action.timestamp
          ) {
            result = action;
          }
        }

      } catch (err) {
        result = null;
      }
    }

    return result;
  }

  public static actionToUrl(action: Action.IAction, endpoint: string): string {
    let result: string = null;

    if (action && endpoint) {
      try {
        result = endpoint;
        if (result.includes('?')) {
          if (!result.endsWith('?')) {
            result = `${result}&`;
          }
        } else {
          result = `${result}?`;
        }

        result = `${result}${this.QUERY_FIELD_NAME}=${encodeURIComponent(JSON.stringify(action, jsonReplacer))}`;
      } catch (err) {
        result = null;
      }
    }

    return result;
  }

  private static QUERY_FIELD_NAME = 'asq';
  private static DEFAULT_ENDPOINT = '://';

  public incoming$ = new UniqueBehaviorSubject<string>(null);
  public outgoing$ = new Subject<string>();

  constructor(
    private options: Url.IOptions,
    adapter: Url.IAdapter,
    action: Action,
  ) {
    this
      .incoming$
      .pipe(
        map(url => Url.urlToAction(url)),
        filter(action => !!action),
        tap(() => {
          this.incoming$.next(null);
        }),
      )
      .subscribe(action.$incoming);

    if (adapter) {
      adapter.addListener(
        url => this.incoming$.next(url || null),
      );

      this
        .outgoing$
        .pipe(
          filter(url => !!url),
        )
        .subscribe(url => adapter.open(url));
    }
  }

  public buildActionUrl(action: Action.IAction, endpoint: string = null): string {
    if (!endpoint) {
      endpoint = this.options && this.options.endpoint
        ? this.options.endpoint
        : Url.DEFAULT_ENDPOINT;
    }

    return Url.actionToUrl(action, endpoint);
  }

  public openActionUrl(action: Action.IAction, endpoint: string = null): void {
    const url = this.buildActionUrl(action, endpoint);
    this.outgoing$.next(url);
  }
}

export namespace Url {
  export interface IOptions {
    endpoint?: string;
  }

  export interface IAdapter {
    open(url: string): any;

    addListener(listener: (url: string) => any): void;
  }
}
