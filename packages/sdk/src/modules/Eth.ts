import EthJs from 'ethjs';
import { ContractNames, getContractAddress } from '@archanova/contracts';
import { Api } from './Api';
import { State } from './State';

export class Eth extends EthJs {
  constructor(
    private options: Eth.IOptions,
    api: Api,
    state: State,
  ) {
    super(api.toEthProvider(Eth.Error));

    state.eth$.next(this.buildState());
  }

  public getNetworkId(): string {
    const { networkId } = this.options;
    return networkId;
  }

  public getContractAddress(contractName: ContractNames): string {
    let result: string = null;
    const { networkId, contractAddresses } = this.options;
    if (
      contractAddresses &&
      contractAddresses[contractName]
    ) {
      result = contractAddresses[contractName];
    }

    if (!result) {
      result = getContractAddress(contractName, networkId);
    }

    return result;
  }

  private buildState(): State.IEth {
    const { networkId } = this.options;
    let networkName: string = 'Unknown';

    switch (networkId) {
      case '1':
        networkName = 'Main';
        break;

      case '3':
        networkName = 'Ropsten';
        break;

      case '4':
        networkName = 'Rinkeby';
        break;

      case '42':
        networkName = 'Kovan';
        break;

      case '77':
        networkName = 'Sokol';
        break;

      case '100':
        networkName = 'xDai';
        break;

      default:
        networkName = 'Local';
    }

    return {
      networkId,
      networkName,
    };
  }
}

export namespace Eth {
  export interface IOptions {
    networkId: string;
    gasPrice?: string;
    contractAddresses?: { [key: string]: string };
  }

  export class Error extends global.Error {
    constructor(public httpError: any = null) {
      super('unknown');
    }
  }
}
