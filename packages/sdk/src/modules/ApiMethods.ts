import BN from 'bn.js';
import { AccountDeviceTypes } from '../constants';
import {
  IAccount,
  IAccountDevice,
  IPaginated,
  IEstimatedAccountDeployment,
  IToken,
  IAccountFriendRecovery,
  IAccountGame,
  IAccountPayment,
  IAccountTransaction,
  IEstimatedAccountProxyTransaction, IAccountVirtualBalance, IApp, IAccountVirtualPendingBalance,
} from '../interfaces';
import { Api } from './Api';

export class ApiMethods {
  constructor(private api: Api) {
    //
  }

// account

  public getConnectedAccounts(page = 0): Promise<IPaginated<IAccount>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account?page=${page || 0}`,
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

  public createAccount(ensName?: string): Promise<IAccount> {
    return this.api.sendRequest({
      method: 'POST',
      path: 'account',
      body: {
        ensName: ensName || null,
      },
    });
  }

  public updateAccountEnsName(accountAddress: string, ensName: string): Promise<IAccount> {
    return this.api.sendRequest<IAccount>({
      method: 'PUT',
      path: `account/${accountAddress}`,
      body: {
        ensName,
      },
    });
  }

  public async estimateAccountDeployment(accountAddress: string, gasPrice: BN): Promise<IEstimatedAccountDeployment> {
    const result = await this.api.sendRequest<IEstimatedAccountDeployment>({
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

  public async deployAccount(accountAddress: string, gasPrice: BN): Promise<string> {
    const { hash } = await this.api.sendRequest<{ hash: string }>({
      method: 'PUT',
      path: `account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return hash;
  }

// account device

  public getAccountDevices(accountAddress: string, page = 0): Promise<IPaginated<IAccountDevice>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/device?page=${page}`,
    });
  }

  public getAccountDevice(accountAddress: string, address: string): Promise<IAccountDevice> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/device/${address}`,
    });
  }

  public createAccountDevice(accountAddress: string, address: string, type: AccountDeviceTypes): Promise<IAccountDevice> {
    return this.api.sendRequest({
      method: 'POST',
      path: `account/${accountAddress}/device`,
      body: {
        type: type || null,
        device: address,
      },
    });
  }

  public updateAccountDevice(accountAddress: string, address: string, type: AccountDeviceTypes): Promise<IAccountDevice> {
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/device/${address}`,
      body: {
        type,
      },
    });
  }

  public async removeAccountDevice(accountAddress: string, address: string): Promise<boolean> {
    const { success } = await this.api.sendRequest<{
      success: true;
    }>({
      method: 'DELETE',
      path: `account/${accountAddress}/device/${address}`,
    });

    return success;
  }

// account friend recovery

  public getAccountFriendRecovery(accountAddress: string): Promise<IAccountFriendRecovery> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/friend-recovery`,
    });
  }

  public async submitAccountFriendRecovery(accountAddress: string, friends: string[], signatures: string[], gasPrice: BN): Promise<string> {
    const { hash } = await this.api.sendRequest<{
      hash: string;
    }>({
      method: 'PUT',
      path: `account/${accountAddress}/friend-recovery`,
      body: {
        friends,
        signatures,
        gasPrice,
      },
    });

    return hash;
  }

// account game

  public getAccountGames(accountAddress: string, app: string, page = 0): Promise<IPaginated<IAccountGame>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/game?page=${page}&app=${app}`,
    });
  }

  public getAccountGame(accountAddress: string, id: number): Promise<IAccountGame> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/game/${id}`,
    });
  }

  public createAccountGame(accountAddress: string, app: string, deposit: { value: number | string | BN, token?: string }, data: string): Promise<IAccountGame> {
    return this.api.sendRequest({
      method: 'POST',
      path: `account/${accountAddress}/game`,
      body: {
        app,
        deposit,
        data,
      },
    });
  }

  public joinAccountGame(accountAddress: string, id: number, signature: Buffer): Promise<IAccountGame> {
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/game/${id}`,
      body: {
        signature,
      },
    });
  }

  public startAccountGame(accountAddress: string, id: number, signature: Buffer): Promise<IAccountGame> {
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/game/${id}`,
      body: {
        signature,
      },
    });
  }

  public updateAccountGame(accountAddress: string, id: number, data: string): Promise<IAccountGame> {
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/game/${id}`,
      body: {
        data,
      },
    });
  }

  public async cancelAccountGame(accountAddress: string, id: number): Promise<boolean> {
    const { success } = await this.api.sendRequest<{ success: true }>({
      method: 'DELETE',
      path: `account/${accountAddress}/game/${id}`,
    });

    return success;
  }

// account payment

  public getAccountPayments(accountAddress: string, page = 0): Promise<IPaginated<IAccountPayment>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/payment?page=${page}`,
    });
  }

  public getAccountPayment(accountAddress: string, hash: string): Promise<IAccountPayment> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/payment/${hash}`,
    });
  }

  public createAccountPayment(
    accountAddress: string,
    recipient: string,
    token: string,
    value: number | string | BN,
  ): Promise<IAccountPayment> {
    return this.api.sendRequest<IAccountPayment>({
      method: 'POST',
      path: `account/${accountAddress}/payment`,
      body: {
        recipient,
        value,
        token: token || null,
      },
    });
  }

  public signAccountPayment(accountAddress: string, hash: string, signature: Buffer): Promise<IAccountPayment> {
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/payment/${hash}`,
      body: {
        signature,
      },
    });
  }

  public async grabAccountPayment(accountAddress: string, hash: string, recipient: string): Promise<IAccountPayment> {
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/payment/${hash}`,
      body: {
        recipient,
      },
    });
  }

  public async cancelAccountPayment(accountAddress: string, hash: string): Promise<boolean> {
    const { success } = await this.api.sendRequest<{ success: true }>({
      method: 'DELETE',
      path: `account/${accountAddress}/payment/${hash}`,
    });
    return success;
  }

// account transaction

  public getAccountTransactions(accountAddress: string, page = 0, hash: string = ''): Promise<IPaginated<IAccountTransaction>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/transaction?page=${page}&hash=${hash}`,
    });
  }

  public getAccountTransaction(accountAddress: string, hash: string, index = 0): Promise<IAccountTransaction> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/transaction/${hash}?index=${index}`,
    });
  }

  public async estimateAccountProxyTransaction(accountAddress: string, data: string | string[], gasPrice: BN): Promise<IEstimatedAccountProxyTransaction> {
    if (!Array.isArray(data)) {
      data = [data];
    }

    const result = await this.api.sendRequest<IEstimatedAccountProxyTransaction>({
      method: 'POST',
      path: `account/${accountAddress}/transaction`,
      body: {
        data,
        gasPrice,
      },
    });

    return {
      ...result,
      data,
      gasPrice,
    };
  }

  public async submitAccountProxyTransaction(accountAddress: string, data: string[], signature: Buffer, gasPrice: BN): Promise<string> {
    const { hash } = await this.api.sendRequest<{ hash: string }>({
      method: 'PUT',
      path: `account/${accountAddress}/transaction`,
      body: {
        data,
        gasPrice,
        signature,
      },
    });

    return hash;
  }

// account virtual balance

  public getAccountVirtualBalances(accountAddress: string, page = 0): Promise<IPaginated<IAccountVirtualBalance>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/virtual-balance?page=${page}`,
    });
  }

  public getAccountVirtualBalance(accountAddress: string, tokenAddressOrSymbol: string): Promise<IAccountVirtualBalance> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/virtual-balance/${tokenAddressOrSymbol}`,
    });
  }

  public getAccountVirtualPendingBalances(accountAddress: string): Promise<IAccountVirtualPendingBalance> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/virtual-balance/pending`,
    });
  }

  public getAccountVirtualPendingBalance(accountAddress: string, tokenAddressOrSymbol: string): Promise<IAccountVirtualPendingBalance> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/virtual-balance/pending/${tokenAddressOrSymbol}`,
    });
  }

// app

  public getApps(page = 0): Promise<IPaginated<IApp>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `app?page=${page}`,
    });
  }

  public getApp(alias: string): Promise<IApp> {
    return this.api.sendRequest({
      method: 'GET',
      path: `app/${alias}`,
    });
  }

  public getAppOpenGames(alias: string, page = 0): Promise<IPaginated<IAccountGame>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `app/${alias}/game?page=${page}`,
    });
  }

// tokens

  public getTokens(page = 0): Promise<IPaginated<IToken>> {
    return this.api.sendRequest({
      method: 'GET',
      path: `token?page=${page}`,
    });
  }

  public getToken(symbolOrAddress: string): Promise<IToken> {
    return this.api.sendRequest({
      method: 'GET',
      path: `token/${symbolOrAddress}`,
    });
  }
}
