import { IAccountVirtualBalance, IPaginated } from '../interfaces';
import { Api } from './Api';
import { State } from './State';

export class AccountVirtualBalance {
  constructor(
    private api: Api,
    private state: State,
  ) {
    //
  }

  public getConnectedAccountVirtualBalances(page = 0): Promise<IPaginated<IAccountVirtualBalance>> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/virtual-balance?page=${page}`,
    });
  }

  public getConnectedAccountVirtualBalance(tokenAddressOrSymbol: string): Promise<IAccountVirtualBalance> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/virtual-balance/${tokenAddressOrSymbol}`,
    });
  }
}
