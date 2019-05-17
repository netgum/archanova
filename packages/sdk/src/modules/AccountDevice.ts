import { AccountDeviceTypes } from '../constants';
import { IAccountDevice, IPaginated } from '../interfaces';
import { AccountTransaction } from './AccountTransaction';
import { Api } from './Api';
import { State } from './State';

export class AccountDevice {
  constructor(
    private accountTransaction: AccountTransaction,
    private api: Api,
    private state: State,
  ) {
    //
  }

  public getConnectedAccountDevices(page = 0): Promise<IPaginated<IAccountDevice>> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/device?page=${page}`,
    });
  }

  public getAccountDevice(accountAddress: string, address: string): Promise<IAccountDevice> {
    return this.api.sendRequest({
      method: 'GET',
      path: `account/${accountAddress}/device/${address}`,
    });
  }

  public createAccountDevice(address: string, type: AccountDeviceTypes): Promise<IAccountDevice> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'POST',
      path: `account/${accountAddress}/device`,
      body: {
        type,
        device: address,
      },
    });
  }

  public updateAccountDevice(address: string, type: AccountDeviceTypes): Promise<IAccountDevice> {
    const { accountAddress } = this.state;
    return this.api.sendRequest({
      method: 'PUT',
      path: `account/${accountAddress}/device/${address}`,
      body: {
        type,
      },
    });
  }

  public async removeAccountDevice(address: string): Promise<boolean> {
    const { accountAddress } = this.state;
    const { success } = await this.api.sendRequest<{
      success: true;
    }>({
      method: 'DELETE',
      path: `account/${accountAddress}/device/${address}`,
    });

    return success;
  }
}
