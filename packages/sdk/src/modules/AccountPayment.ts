import BN from 'bn.js';
import { abiEncodePacked, ZERO_ADDRESS } from '@netgum/utils';
import { IAccountPayment, IPaginated } from '../interfaces';
import { Api } from './Api';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountPayment {
  constructor(
    private api: Api,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public getConnectedAccountPayments(page = 0): Promise<IPaginated<IAccountPayment>> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/payment?page=${page}`,
    });
  }

  public getConnectedAccountPayment(hash: string): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/payment/${hash}`,
    });
  }

  public async createAccountPayment(
    recipient: string,
    token: string,
    value: number | string | BN,
  ): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    let payment = await this.api.sendRequest<IAccountPayment>({
      method: 'POST',
      path: `account/${accountAddress}/payment`,
      body: {
        recipient,
        token,
        value,
      },
    });

    if (payment && recipient) {
      payment = await this.signAccountPayment(payment);
    }

    return payment;
  }

  public async signAccountPayment(payment: IAccountPayment): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    const { hash, value, recipient, token } = payment;
    const { address } = this.contract.virtualPaymentManager;
    const message = abiEncodePacked(
      'address',
      'address',
      'address',
      'address',
      'bytes',
      'uint256',
    )(
      address,
      accountAddress,
      recipient.address || recipient.account.address,
      token && token.address ? token.address : ZERO_ADDRESS,
      hash,
      value,
    );

    const signature = this.device.signPersonalMessage(message);

    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/payment/${hash}`,
      body: {
        signature,
      },
    });
  }

  public async grabAccountPayment(hash: string, recipient: string): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/payment/${hash}`,
      body: {
        recipient,
      },
    });
  }

  public async cancelAccountPayment(hash: string): Promise<boolean> {
    const { accountAddress } = this.state;
    const { success } = await this.api.sendRequest<{ success: true }>({
      method: 'DELETE',
      path: `account/${accountAddress}/payment/${hash}`,
    });
    return success;
  }
}
