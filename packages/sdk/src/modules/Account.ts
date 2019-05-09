import BN from 'bn.js';
import { IAccount, IPaginated } from '../interfaces';
import { Api } from './Api';
import { State } from './State';

export class Account {
  constructor(private api: Api, private state: State) {
    //
  }

  public getConnectedAccounts(page = 0): Promise<IPaginated<IAccount>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account?page=${page}`,
    });
  }

  public getAccount(address: string): Promise<IAccount> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${address}`,
    });
  }

  public searchAccount(ensName: string): Promise<IAccount> {
    return this.api.sendRequest({
      method: 'POST',
      path: 'account/search',
      body: {
        ensName,
      },
    });
  }

  public async createAccount(ensName?: string): Promise<void> {
    const account = await this.api.sendRequest<IAccount>({
      method: 'POST',
      path: 'account',
      body: {
        ensName,
      },
    });

    this.state.account$.next(account);
  }

  public async updateAccount(ensName: string): Promise<void> {
    const { accountAddress } = this.state;
    const account = await this.api.sendRequest<IAccount>({
      method: 'PUT',
      path: `account/${accountAddress}`,
      body: {
        ensName,
      },
    });

    this.state.account$.next(account);
  }

  public async estimateAccountDeployment(gasPrice: BN): Promise<Account.IEstimatedDeployment> {
    const { accountAddress } = this.state;
    const result = await this.api.sendRequest<Account.IEstimatedDeployment>({
      method: 'POST',
      path: `account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return {
      ...result,
      gasPrice,
    };
  }

  public async deployAccount(gasPrice: BN): Promise<string> {
    const { accountAddress } = this.state;
    const { hash } = await this.api.sendRequest<{ hash: string }>({
      method: 'PUT',
      path: `account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return hash;
  }
}

export namespace Account {
  export interface IEstimatedDeployment {
    gasPrice?: BN;
    totalGas: BN;
    totalCost: BN;
  }
}
