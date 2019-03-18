import { IBN } from 'bn.js';

export interface IAccountProxyService {
  estimateTransaction(accountAddress: string, to: string, value: IBN, data: Buffer, gasPrice: IBN): Promise<IAccountProxyService.IEstimatedTransaction>;

  estimateDeployDevice(accountAddress: string, deviceAddress: string, gasPrice: IBN): Promise<IAccountProxyService.IEstimatedTransaction>;

  executeTransaction(accountAddress: string, estimated: IAccountProxyService.IEstimatedTransaction, gasPrice: IBN): Promise<string>;

  deployDevice(accountAddress: string, deviceAddress: string, estimated: IAccountProxyService.IEstimatedTransaction, gasPrice: IBN): Promise<string>;
}

export namespace IAccountProxyService {
  export interface IOptions {
    contractAddress: string;
  }

  export interface IEstimatedTransaction {
    nonce: IBN;
    data: Buffer;
    fixedGas: IBN;
    internalGas: IBN;
    cost: IBN;
  }
}
