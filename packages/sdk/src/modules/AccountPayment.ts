import BN from 'bn.js';
import { abiEncodePacked, ZERO_ADDRESS } from '@netgum/utils';
import { IAccountPayment } from '../interfaces';
import { ApiMethods } from './ApiMethods';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountPayment {
  constructor(
    private apiMethods: ApiMethods,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public async createAccountPayment(
    recipient: string,
    token: string,
    value: number | string | BN,
  ): Promise<IAccountPayment> {
    const { accountAddress } = this.state;
    let payment = await this.apiMethods.createAccountPayment(accountAddress, recipient, token, value);

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

    return this.apiMethods.signAccountPayment(accountAddress, hash, signature);
  }
}
