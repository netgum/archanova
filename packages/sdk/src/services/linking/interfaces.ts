import { Subject } from 'rxjs';
import { LinkingUrlTargets } from './constants';

export interface ILinkingService {
  incomingUrl$: Subject<string>;
  incomingActionUrl$: Subject<ILinkingService.IActionUrl>;
  acceptedActionUrl$: Subject<ILinkingService.IActionUrl>;

  setup(): void;

  acceptActionUrl(actionUrl: ILinkingService.IActionUrl): void;

  createActionUrl<T = any>(action: ILinkingService.IAction<T>): ILinkingService.TUrlCreator;
}

export namespace ILinkingService {
  export interface IOptions {
    walletIOSEndpoint?: string;
    callbackEndpoint?: string;
  }

  export interface IAction<T = any> {
    type: string;
    payload?: T;
  }

  export interface IActionUrl {
    callbackEndpoint: string;
    action: IAction;
    timestamp: number;
  }

  export type TUrlCreator = (target: LinkingUrlTargets, callbackUrl?: string) => string;
}
