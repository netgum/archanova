import BN from 'bn.js';
import { abiEncodePacked } from '@netgum/utils';
import { IAccountGame, IPaginated } from '../interfaces';
import { Api } from './Api';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountGame {
  constructor(
    private api: Api,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public getConnectedAccountGames(app: string, page = 0): Promise<IPaginated<IAccountGame>> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/game?page=${page}&app=${app}`,
    });
  }

  public getAccountGame(id: number): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/game/${id}`,
    });
  }

  public createAccountGame(app: string, deposit: number | string | BN, data: string): Promise<IAccountGame> {
    const { accountAddress } = this.state;
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

  public joinAccountGame(accountGame: IAccountGame): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    const { id, deposit, creator: { account, payment } } = accountGame;
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
      account.address,
      payment.hash,
      deposit,
    );

    const signature = this.device.signPersonalMessage(message);

    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/game/${id}`,
      body: {
        signature,
      },
    });
  }

  public startAccountGame(accountGame: IAccountGame): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    const { id, deposit, opponent: { account, payment } } = accountGame;
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
      account.address,
      payment.hash,
      deposit,
    );

    const signature = this.device.signPersonalMessage(message);

    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/game/${id}`,
      body: {
        signature,
      },
    });
  }

  public updateAccountGame(game: IAccountGame, data: string): Promise<IAccountGame> {
    const { accountAddress } = this.state;

    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/game/${game.id}`,
      body: {
        data,
      },
    });
  }
}
