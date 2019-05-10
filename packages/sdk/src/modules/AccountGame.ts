import BN from 'bn.js';
import { abiEncodePacked } from '@netgum/utils';
import { IAccountGame, IAccountGameHistory, IPaginated } from '../interfaces';
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

  public getConnectedAccountGames(app: string = null, page = 0): Promise<IPaginated<IAccountGame>> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/game?app=${app}&page=${page}`,
    });
  }

  public getConnectedAccountGame(gameId: number): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/game${gameId}`,
    });
  }

  public getConnectedAccountGameHistory(gameId: number, page = 0): Promise<IPaginated<IAccountGameHistory>> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/game/${gameId}/history?&page=${page}`,
    });
  }

  public createAccountGame(app: string, deposit: BN | number | string, stateValue: string): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    return this.api.sendRequest<IAccountGame>({
      method: 'POST',
      path: `account/${accountAddress}/game`,
      body: {
        app,
        deposit,
        stateValue,
      },
    });
  }

  public joinAccountGame(game: IAccountGame, stateValue: string): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    const { virtualPaymentManager } = this.contract;
    const { creator } = game;

    const message = abiEncodePacked(
      'address',
      'address',
      'address',
      'uint256',
      'uint256',
    )(
      virtualPaymentManager.address,
      accountAddress,
      creator.address,
      game.id,
      game.deposit,
    );

    const signature = this.device.signPersonalMessage(message);

    return this.api.sendRequest<IAccountGame>({
      method: 'PUT',
      path: `account/${accountAddress}/game/${game.id}`,
      body: {
        stateValue,
        signature,
      },
    });
  }

  public makeAccountGameMove(game: IAccountGame, stateValue: string): Promise<IAccountGame> {
    const { accountAddress } = this.state;
    const { virtualPaymentManager } = this.contract;
    const { creator, opponent, creatorSignature } = game;

    let signature: Buffer = null;
    const messageBuilder = abiEncodePacked(
      'address',
      'address',
      'address',
      'uint256',
      'uint256',
    );

    if (
      creator.address === accountAddress &&
      !creatorSignature
    ) {
      signature = messageBuilder(
        virtualPaymentManager.address,
        accountAddress,
        opponent.address,
        game.id,
        game.deposit,
      );
    }

    return this.api.sendRequest<IAccountGame>({
      method: 'PUT',
      path: `account/${accountAddress}/game/${game.id}`,
      body: {
        stateValue,
        signature,
      },
    });
  }
}
