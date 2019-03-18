import { IBN } from 'bn.js';
import { IApiService } from '../api';
import { IAccount } from '../account';
import { IAccountProviderService } from './interfaces';

export class AccountProviderService implements IAccountProviderService {

  constructor(
    private options: IAccountProviderService.IOptions,
    private apiService: IApiService,
  ) {
    //
  }

  public async createAccount(ensLabel: string = null): Promise<IAccount> {
    const { contractAddress } = this.options;
    const { item } = await this.apiService.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'POST',
      path: `account-provider/${contractAddress}/account`,
      body: ensLabel
        ? { ensLabel }
        : {},
    });

    return item;
  }

  public async updateAccount(accountAddress: string, ensLabel: string): Promise<IAccount> {
    const { contractAddress } = this.options;
    const { item } = await this.apiService.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'PUT',
      path: `account-provider/${contractAddress}/account/${accountAddress}`,
      body: {
        ensLabel,
      },
    });

    return item;
  }

  public async estimateDeployAccountCost(accountAddress: string, gasPrice: IBN): Promise<IBN> {
    const { contractAddress } = this.options;
    const { refundAmount } = await this.apiService.sendHttpRequest<{
      refundAmount: IBN;
    }>({
      method: 'POST',
      path: `account-provider/${contractAddress}/account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return refundAmount;
  }

  public async deployAccount(accountAddress: string, gasPrice: IBN): Promise<string> {
    const { contractAddress } = this.options;
    const { hash } = await this.apiService.sendHttpRequest<{
      refundAmount: IBN;
      hash: string;
    }>({
      method: 'PUT',
      path: `account-provider/${contractAddress}/account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return hash;
  }
}
