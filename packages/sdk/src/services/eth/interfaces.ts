import { TUniqueBehaviorSubject } from 'rxjs-addons';
import { IBN } from 'bn.js';
import { IPlatformService } from '../platform';

export interface IEthService extends IPlatformService {
  readonly networkVersion$: TUniqueBehaviorSubject<string>;
  readonly networkVersion: string;

  setup(): Promise<void>;

  getGasPrice(): Promise<IBN>;

  getBalance(target: any): Promise<IBN>;

  getTransactionCount(target: any): Promise<IBN>;
}

export namespace IEthService {
  export interface IOptions extends IPlatformService.IOptions {
    customProvider?: any;
  }
}
