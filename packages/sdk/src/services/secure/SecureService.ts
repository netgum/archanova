import { anyToHex } from '@netgum/utils';
import { IApiService } from '../api';
import { IDeviceService } from '../device';
import { ISecureService } from './interfaces';

export class SecureService implements ISecureService {
  private code: string = null;

  constructor(
    private apiService: IApiService,
    private deviceService: IDeviceService,
  ) {
    //
  }

  public async createSecureCode(): Promise<string> {
    const { code } = await this.apiService.sendHttpRequest<{
      code: string;
    }>({
      method: 'POST',
      path: 'secure',
      body: {},
    });

    this.code = code;

    return code;
  }

  public async signSecureCode(creatorAddress: string, code: string): Promise<boolean> {
    const signature = anyToHex(
      await this.deviceService.signPersonalMessage(code), { add0x: true },
    );

    const { success } = await this.apiService.sendHttpRequest<{
      success: boolean;
    }, {
      creatorAddress: string;
      signature: string;
    }>({
      method: 'PUT',
      path: 'secure',
      body: {
        creatorAddress,
        signature,
      },
    });

    return success;
  }

  public verifySecureCode(code: string): boolean {
    return (
      code &&
      this.code &&
      this.code === code
    );
  }

  public async destroySecureCode(): Promise<boolean> {
    this.code = null;

    const { success } = await this.apiService.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: 'secure',
    });

    return success;
  }
}
