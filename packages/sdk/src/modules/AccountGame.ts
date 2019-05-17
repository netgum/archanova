import BN from 'bn.js';
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
}
