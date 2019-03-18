import { Subject } from 'rxjs';
import { TUniqueBehaviorSubject } from 'rxjs-addons';

export interface IApiService {
  setSessionToken(sessionToken?: string): void;

  buildWsSubjects(): IApiService.IWsSubjects;

  sendHttpRequest<T = any, B = any>(req: IApiService.IHttpRequest<B>): Promise<T>;
}

export namespace IApiService {
  export interface IOptions {
    host: string;
    port: number;
    useSsl: boolean;
    reconnectTimeout: number;
  }

  export interface IWsSubjects {
    connected$: TUniqueBehaviorSubject<boolean>;
    message$: Subject<any>;
  }

  export interface IHttpRequest<T = any> {
    method: string;
    path?: string;
    body?: T;
    dontUseReplacer?: boolean;
  }
}
