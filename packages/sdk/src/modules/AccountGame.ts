import { abiEncodePacked, ZERO_ADDRESS } from '@netgum/utils';
import { IAccountGame } from '../interfaces';
import { ApiMethods } from './ApiMethods';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountGame {
  constructor(
    private apiMethods: ApiMethods,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public joinAccountGame(accountGame: IAccountGame): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    const { id, deposit, creator: { account, payment } } = accountGame;
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
      account.address,
      deposit.token ? deposit.token.address : ZERO_ADDRESS,
      payment.hash,
      deposit.value,
    );

    const signature = this.device.signPersonalMessage(message);

    return this.apiMethods.joinAccountGame(accountAddress, id, signature);
  }

  public startAccountGame(accountGame: IAccountGame): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    const { id, deposit, opponent: { account, payment } } = accountGame;
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
      account.address,
      deposit.token ? deposit.token.address : ZERO_ADDRESS,
      payment.hash,
      deposit.value,
    );

    const signature = this.device.signPersonalMessage(message);

    return this.apiMethods.startAccountGame(accountAddress, id, signature);
  }
}
