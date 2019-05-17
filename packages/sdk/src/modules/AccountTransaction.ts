import BN from 'bn.js';
import { abiEncodePacked } from '@netgum/utils';
import { IAccountTransaction, IPaginated } from '../interfaces';
import { Api } from './Api';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountTransaction {
  constructor(
    private api: Api,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public getConnectedAccountTransactions(page = 0): Promise<IPaginated<IAccountTransaction>> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/transaction?page=${page}`,
    });
  }

  public getAccountTransaction(accountAddress: string, hash: string): Promise<IAccountTransaction> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/transaction/${hash}`,
    });
  }

  public async estimateAccountProxyTransaction(data: string, gasPrice: BN): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    const { accountAddress } = this.state;
    const result = await this.api.sendRequest<AccountTransaction.IEstimatedProxyTransaction>({
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

  public async submitAccountProxyTransaction({ nonce, data, fixedGas, gasPrice }: AccountTransaction.IEstimatedProxyTransaction): Promise<string> {
    const { accountAddress } = this.state;
    const { accountProxy } = this.contract;
    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      accountProxy.address,
      accountProxy.getMethodSignature('forwardAccountOwnerCall'),
      accountAddress,
      nonce,
      data,
      fixedGas,
      gasPrice,
    );

    const signature = this.device.signPersonalMessage(message);

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
}

export namespace AccountTransaction {
  export interface IEstimatedProxyTransaction {
    nonce: BN;
    gasPrice?: BN;
    data?: string;
    fixedGas: BN;
    totalGas: BN;
    totalCost: BN;
  }
}
