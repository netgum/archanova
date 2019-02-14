import { inject, injectable } from 'inversify';
import { jsonReplacer, jsonReviver } from '@netgum/utils';
import { Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { LinkingUrlTargets } from './constants';
import { ILinkingService } from './interfaces';

@injectable()
export class LinkingService implements ILinkingService {

  public static TYPES = {
    Options: Symbol('LinkingService:Options'),
  };

  public static QUERY_FIELD_NAME = 'sdkQuery';

  public incomingUrl$ = new Subject<string>();
  public incomingActionUrl$ = new Subject<ILinkingService.IActionUrl>();
  public acceptedActionUrl$ = new Subject<ILinkingService.IActionUrl>();

  private readonly options: ILinkingService.IOptions;

  constructor(
    @inject(LinkingService.TYPES.Options) options: ILinkingService.IOptions,
  ) {
    this.options = {
      walletIOSEndpoint: '://',
      callbackEndpoint: null,
      ...options,
    };
  }

  public setup(): void {
    this
      .incomingUrl$
      .pipe(
        map((url) => {
          let result: ILinkingService.IActionUrl = null;
          try {
            const [, actionUrlRaw] = url.split(`${LinkingService.QUERY_FIELD_NAME}=`);

            if (actionUrlRaw) {
              const actionUrl: ILinkingService.IActionUrl = JSON.parse(decodeURIComponent(actionUrlRaw), jsonReviver);
              if (
                actionUrl.action &&
                actionUrl.timestamp
              ) {
                result = actionUrl;
              }
            }
          } catch (err) {
            result = null;
          }

          return result;
        }),
        filter(actionUrl => !!actionUrl),
      )
      .subscribe(this.incomingActionUrl$);

    // TODO: REMOVE
    this.incomingActionUrl$.subscribe(this.acceptedActionUrl$);
  }

  public acceptActionUrl(actionUrl: ILinkingService.IActionUrl): void {
    this.acceptedActionUrl$.next(actionUrl);
  }

  public createActionUrl<T = any>(action: ILinkingService.IAction<T>): ILinkingService.TUrlCreator {
    return (target: LinkingUrlTargets, callbackUrl: string = null) => {
      let result: string = null;

      const actionUrl: ILinkingService.IActionUrl = {
        action,
        callbackEndpoint: null,
        timestamp: Date.now(),
      };

      switch (target) {
        case LinkingUrlTargets.WalletIOS: {
          const { walletIOSEndpoint, callbackEndpoint } = this.options;
          result = walletIOSEndpoint;
          if (callbackEndpoint) {
            actionUrl.callbackEndpoint = callbackEndpoint;
          }
          break;
        }

        case LinkingUrlTargets.Callback: {
          if (callbackUrl) {
            result = callbackUrl;
          }
          break;
        }
      }

      if (result) {
        if (result.includes('?')) {
          if (!result.endsWith('?')) {
            result = `${result}&`;
          }
        } else {
          result = `${result}?`;
        }

        result = `${result}${LinkingService.QUERY_FIELD_NAME}=${encodeURIComponent(JSON.stringify(actionUrl, jsonReplacer))}`;
      }

      return result;
    };
  }
}
