import { Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { IAction, IActionService } from '../action';
import { IUrlService } from './interfaces';
import { actionToUrl, urlToAction } from './helpers';
import { URL_DEFAULT_ENDPOINT } from './constants';

export class UrlService implements IUrlService {

  public incoming$ = new UniqueBehaviorSubject<string>(null);

  public outgoing$ = new Subject<string>();

  constructor(
    private options: IUrlService.IOptions,
    private actionService: IActionService,
  ) {
    //
  }

  public setup(): void {
    this
      .incoming$
      .pipe(
        map(url => urlToAction(url)),
        filter(action => !!action),
        tap(() => {
          this.incoming$.next(null);
        }),
      )
      .subscribe(this.actionService.$incoming);

    const { listener, opener } = this.options;

    if (listener) {
      listener(url => this.incoming$.next(url || null));
    }

    if (opener) {
      this
        .outgoing$
        .pipe(
          filter(url => !!url),
        )
        .subscribe(url => opener(url));
    }
  }

  public buildActionUrl<T = any>(action: IAction<T>, endpoint: string = null): string {
    if (!endpoint) {
      endpoint = this.options.endpoint || URL_DEFAULT_ENDPOINT;
    }

    return actionToUrl(action, endpoint);
  }

  public openActionUrl<T = any>(action: IAction<T>, endpoint: string = null): void {
    this.outgoing$.next(
      this.buildActionUrl(action, endpoint),
    );
  }
}
