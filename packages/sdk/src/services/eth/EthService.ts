import { targetToAddress } from '@netgum/utils';
import * as BN from 'bn.js';
import * as Eth from 'ethjs';
import { EthError } from './EthError';
import { IEthService } from './interfaces';

export class EthService implements IEthService {
  constructor(
    options: IEthService.IOptions,
    private readonly eth: Eth.IEth = null,
  ) {
    if (!this.eth) {
      const { providerEndpoint, customProvider } = options;

      const provider = customProvider
        ? customProvider
        : {
          sendAsync: (payload: any, callback: (err: any, data: any) => void) => {
            const options: RequestInit = {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
              }),
              body: JSON.stringify(payload),
            };

            fetch(providerEndpoint, options)
              .then(res => res.json())
              .then(data => callback(null, data))
              .catch(err => callback(new EthError(err), null));
          },
        };

      this.eth = new Eth(provider);
    }
  }

  public getNetworkVersion(): Promise<string> {
    return this.eth.net_version();
  }

  public getGasPrice(): Promise<BN.IBN> {
    return this.eth.gasPrice();
  }

  public async getBalance(target: any): Promise<BN.IBN> {
    let result: BN.IBN = new BN(0);
    const address: string = targetToAddress(target);

    if (address) {
      result = await this.eth.getBalance(address, 'pending').catch(() => null);
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
