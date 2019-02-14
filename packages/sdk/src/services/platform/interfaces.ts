import { Subject } from 'rxjs';
import { TUniqueBehaviorSubject } from 'rxjs-addons';

export interface IPlatformService {
  //
}

export namespace IPlatformService {
  export interface IOptions {
    host: string;
    port: number;
    useSsl: boolean;
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
