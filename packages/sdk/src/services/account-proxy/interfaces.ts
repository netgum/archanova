import { IBN } from 'bn.js';
import { IPlatformService } from '../platform';

export interface IAccountProxyService extends IPlatformService {
  estimateTransaction(to: string, value: IBN, data?: Buffer): Promise<IAccountProxyService.IEstimatedTransaction>;

  estimateDeployDevice(deviceAddress: string): Promise<IAccountProxyService.IEstimatedTransaction>;

  executeTransaction(estimated: IAccountProxyService.IEstimatedTransaction): Promise<string>;

  deployDevice(deviceAddress: string, estimated: IAccountProxyService.IEstimatedTransaction): Promise<string>;
}

export namespace IAccountProxyService {
  export interface IOptions extends IPlatformService.IOptions {
    contractAddress: string;
  }

  export interface IEstimatedTransaction extends ISendEstimateTransactionResponse {
    gasPrice: IBN;
  }

  export interface ISendEstimateTransactionResponse {
    nonce: IBN;
    data: Buffer;
    fixedGas: IBN;
    internalGas: IBN;
    cost: IBN;
  }

  export interface ISendEstimateTransactionBody {
    to: string;
    value: IBN;
    gasPrice: IBN;
    data: Buffer;
  }

  export interface ISendExecuteTransactionBody {
    nonce: IBN;
    data: Buffer;
    signature: Buffer;
    gasPrice: IBN;
  }
}
