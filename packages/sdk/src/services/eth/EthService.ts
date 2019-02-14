import { injectable, inject, unmanaged } from 'inversify';
import { targetToAddress } from '@netgum/utils';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import * as BN from 'bn.js';
import * as Eth from 'ethjs';
import { TYPES } from '../../constants';
import { IStorage } from '../../storage';
import { PlatformService } from '../platform';
import { EthError } from './EthError';
import { IEthService } from './interfaces';

@injectable()
export class EthService extends PlatformService implements IEthService {
  public static TYPES = {
    Options: Symbol('EthService:Options'),
  };

  public static STORAGE_KEYS = {
    networkVersion: 'EthService/networkVersion',
  };

  public readonly networkVersion$ = new UniqueBehaviorSubject<string>(null);

  constructor(
    @inject(EthService.TYPES.Options) options: IEthService.IOptions,
    @inject(TYPES.Storage) private storage: IStorage,
    @unmanaged() private readonly eth: Eth.IEth = null,
  ) {
    super(options);

    if (!this.eth) {
      const { customProvider } = options;

      const provider = customProvider
        ? customProvider
        : {
          sendAsync: (payload: any, callback: (err: any, data: any) => void) => {
            this
              .sendHttpRequest({
                method: 'POST',
                body: payload,
                dontUseReplacer: true,
              })
              .then((data) => {
                callback(null, data);
              })
              .catch(err => callback(new EthError(err), null));
          },
        };

      this.eth = new Eth(provider);
    }
  }

  public get networkVersion(): string {
    return this.networkVersion$.getValue();
  }

  public async setup(): Promise<void> {
    let storageNetworkVersion: string = null;

    if (this.storage) {
      storageNetworkVersion = await this.storage.getItem<string>(EthService.STORAGE_KEYS.networkVersion);
    }

    let networkVersion: string = null;

    if (!networkVersion) {
      networkVersion = await this.eth.net_version();
    } else {
      try {
        networkVersion = await this.eth.net_version();
      } catch (err) {
        networkVersion = storageNetworkVersion;
      }
    }

    if (
      this.storage &&
      (!storageNetworkVersion || storageNetworkVersion !== networkVersion)
    ) {
      await this.storage.setItem(EthService.STORAGE_KEYS.networkVersion, networkVersion);
    }

    this.networkVersion$.next(networkVersion);
  }

  public getGasPrice(): Promise<BN.IBN> {
    return this.eth.gasPrice();
  }

  public async getBalance(target: any): Promise<BN.IBN> {
    let result: BN.IBN = new BN(0);
    const address: string = targetToAddress(target);

    if (address) {
      result = await this.eth.getBalance(address, 'pending');
    }

    return result;
  }

  public async getTransactionCount(target: any): Promise<BN.IBN> {
    let result: BN.IBN = new BN(0);
    const address: string = targetToAddress(target);

    if (address) {
      result = await this.eth.getTransactionCount(address, 'pending');
    }

    return result;
  }
}
