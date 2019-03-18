import { IBN } from 'bn.js';
import { IApiService } from '../api';
import { IFaucetService } from './interfaces';

export class FaucetService implements IFaucetService {

  constructor(
    private apiService: IApiService,
  ) {
    //
  }

  public async getFunds(accountAddress: string): Promise<IFaucetService.IReceipt> {
    let result: IFaucetService.IReceipt = null;

    if (accountAddress) {
      const { value, ...receipt } = await this.apiService.sendHttpRequest<{
        hash: string;
        value: IBN;
        calledAt: number;
        lockedTo: number;
      }>({
        method: 'POST',
        path: `faucet/${accountAddress}`,
        body: {},
      });

      const calledAt = Date.now();

      result = {
        value,
        lockedTo: calledAt + receipt.lockedTo - receipt.calledAt,
      };
    }

    return result;
  }
}
