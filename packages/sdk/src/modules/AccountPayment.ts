import BN from 'bn.js';
import { abiEncodePacked } from '@netgum/utils';
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
    receiver: string,
    value: number | string | BN,
  ): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    let payment = await this.api.sendRequest<IAccountPayment>({
      method: 'POST',
      path: `account/${accountAddress}/payment`,
      body: {
        receiver,
        value,
      },
    });

    if (payment && receiver) {
      payment = await this.signAccountPayment(payment);
    }

    return payment;
  }

  public async signAccountPayment(payment: IAccountPayment): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    const { hash, value, receiver } = payment;
    const { address } = this.contract.virtualPaymentManager;
    const message = abiEncodePacked(
      'address',
      'address',
      'address',
      'bytes',
      'uint256',
    )(
      address,
      accountAddress,
      receiver.address || receiver.account.address,
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

  public async grabAccountPayment(hash: string, receiver: string): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/payment/${hash}`,
      body: {
        receiver,
      },
    });
  }
}
