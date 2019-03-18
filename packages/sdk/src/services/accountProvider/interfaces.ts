import { IBN } from 'bn.js';
import { IAccount } from '../account';

export interface IAccountProviderService {

  createAccount(ensLabel?: string): Promise<IAccount>;

  updateAccount(accountAddress: string, ensLabel: string): Promise<IAccount>;

  estimateDeployAccountCost(accountAddress: string, gasPrice: IBN): Promise<IBN>;

  deployAccount(accountAddress: string, gasPrice: IBN): Promise<string>;
}

export namespace IAccountProviderService {
  export interface IOptions {
    contractAddress: string;
  }
}
