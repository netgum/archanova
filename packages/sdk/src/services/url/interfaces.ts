import { Subject } from 'rxjs';
import { IAction } from '../action';

export interface IUrlService {
  incoming$: Subject<string>;

  outgoing$: Subject<string>;

  setup(): void;

  buildActionUrl<T = any>(action: IAction<T>, endpoint?: string): string;

  openActionUrl<T = any>(action: IAction<T>, endpoint?: string): void;
}

export namespace IUrlService {
  export interface IOptions {
    endpoint?: string;
    opener?: (url: string) => any;
    listener?: (callback: (url: string) => any) => any;
  }
}
