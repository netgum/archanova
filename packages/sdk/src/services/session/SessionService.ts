import { anyToHex } from '@netgum/utils';
import { IApiService } from '../api';
import { IDeviceService } from '../device';
import { ISessionService } from './interfaces';

export class SessionService implements ISessionService {
  constructor(
    private apiService: IApiService,
    private deviceService: IDeviceService,
  ) {
    //
  }

  public async createSession(deviceAddress: string): Promise<boolean> {
    // create session code
    const { code } = await this.apiService.sendHttpRequest<{
      code: string;
    }, {
      deviceAddress: string;
    }>({
      method: 'POST',
      path: 'auth',
      body: {
        deviceAddress,
      },
    });

    const signature = anyToHex(await this.deviceService.signPersonalMessage(code), {
      add0x: true,
    });

    // create session token
    const { token } = await this.apiService.sendHttpRequest<{
      token: string;
    }, {
      code: string;
      signature: string;
    }>({
      method: 'PUT',
      path: 'auth',
      body: {
        code,
        signature,
      },
    });

    this.apiService.setSessionToken(token);

    return true;
  }

  public async resetSession(): Promise<boolean> {
    await this.apiService.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: 'auth',
    });

    this.apiService.setSessionToken();

    return true;
  }
}
