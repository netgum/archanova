import { injectable, inject } from 'inversify';
import { anyToHex } from '@netgum/utils';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { TYPES } from '../../constants';
import { IPlatformService, PlatformService } from '../platform';
import { IDeviceService } from '../device';
import { ISessionService } from './interfaces';

@injectable()
export class SessionService extends PlatformService implements ISessionService {
  public static TYPES = {
    Options: Symbol('SessionService:Options'),
  };

  public readonly ready$ = new UniqueBehaviorSubject<boolean>(false);

  constructor(
    @inject(SessionService.TYPES.Options) options: IPlatformService.IOptions,
    @inject(TYPES.DeviceService) private deviceService: IDeviceService,
  ) {
    super(options);
  }

  public get ready(): boolean {
    return this.ready$.getValue();
  }

  public async create(): Promise<void> {
    if (this.ready) {
      throw new Error('Session already created');
    }

    const code = await this.sendCreateCode();
    const token = await this.sendCreateToken(code);

    PlatformService.sessionToken$.next(token);

    this.ready$.next(true);
  }

  public async reset(): Promise<void> {
    if (!this.ready) {
      await this.create();
      return;
    }

    this.ready$.next(false);

    await this.sendDestroy();

    PlatformService.sessionToken$.next(null);

    await this.create();
  }

  private async sendCreateCode(): Promise<string> {
    const { code } = await this.sendHttpRequest<{
      code: string;
    }, {
      deviceAddress: string;
    }>({
      method: 'POST',
      path: 'session',
      body: {
        deviceAddress: this.deviceService.device.address,
      },
    });

    return code;
  }

  private async sendCreateToken(code: string): Promise<string> {
    const signature = anyToHex(await this.deviceService.signPersonalMessage(code), {
      add0x: true,
    });

    const { token } = await this.sendHttpRequest<{
      token: string;
    }, {
      code: string;
      signature: string;
    }>({
      method: 'PUT',
      path: 'session',
      body: {
        code,
        signature,
      },
    });

    return token;
  }

  private async sendDestroy(): Promise<boolean> {
    const { success } = await this.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: 'session',
    });

    return success;
  }
}
