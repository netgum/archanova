import { IBN } from 'bn.js';
import { IPlatformService } from '../platform';

export interface IAccountProxyService extends IPlatformService {
  estimateTransaction(to: string, value: IBN, data?: Buffer): Promise<IAccountProxyService.IEstimatedTransaction>;

  executeTransaction(estimated: IAccountProxyService.IEstimatedTransaction): Promise<string>;
}

export namespace IAccountProxyService {
  export interface IOptions extends IPlatformService.IOptions {
    contractAddress: string;
  }

  export interface IEstimatedTransaction extends ISendEstimateTransactionResponse {
    to: string;
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
