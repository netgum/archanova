import BN from 'bn.js';
import { IAccount, IPaginated } from '../interfaces';
import { Api } from './Api';
import { Eth } from './Eth';
import { State } from './State';

export class Account {
  constructor(private api: Api, private eth: Eth, private state: State) {
    //
  }

  public getConnectedAccounts(page = 0): Promise<IPaginated<IAccount>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account?page=${page}`,
    });
  }

  public async getAccount(address: string): Promise<IAccount> {
    const account = await this.api.sendRequest({
      method: 'GET',
      path: `account/${address}`,
    });

    return this.prepareAccount(account);
  }

  public async searchAccount(ensName: string): Promise<IAccount> {
    const account = await this.api.sendRequest({
      method: 'POST',
      path: 'account/search',
      body: {
        ensName,
      },
    });

    return this.prepareAccount(account);
  }

  public async createAccount(ensName?: string): Promise<void> {
    const account = await this.api.sendRequest<IAccount>({
      method: 'POST',
      path: 'account',
      body: {
        ensName,
      },
    });

    this.state.account$.next(await this.prepareAccount(account));
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

  private async prepareAccount(account: IAccount): Promise<IAccount> {
    try {

      const balance = await this.eth.getBalance(account.address, 'pending');
      if (balance) {
        account.balance.real = balance;
      }
    } catch (err) {
      //
    }

    return account;
  }
}

export namespace Account {
  export interface IEstimatedDeployment {
    gasPrice?: BN;
    totalGas: BN;
    totalCost: BN;
  }
}
