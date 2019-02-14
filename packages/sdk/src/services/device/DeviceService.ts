import { injectable, inject, optional } from 'inversify';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { generateRandomPrivateKey, privateToPublicKey, publicKeyToAddress, signPersonalMessage } from '@netgum/utils';
import { TYPES } from '../../constants';
import { IStorage } from '../../storage';
import { IDeviceService, IDevice } from './interfaces';

@injectable()
export class DeviceService implements IDeviceService {
  public static STORAGE_KEYS = {
    privateKey: 'DeviceService/privateKey',
  };

  public device$ = new UniqueBehaviorSubject<IDevice>(null);

  private publicKey: Buffer = null;
  private privateKey: Buffer = null;

  constructor(
    @inject(TYPES.Storage) @optional() private storage: IStorage,
  ) {
    //
  }

  public get device(): IDevice {
    return this.device$.getValue();
  }

  public async setup(): Promise<void> {
    let privateKey: Buffer = null;

    if (this.storage) {
      privateKey = await this.storage.getItem<Buffer>(DeviceService.STORAGE_KEYS.privateKey);
    }

    if (!privateKey) {
      privateKey = generateRandomPrivateKey();

      if (this.storage) {
        await this.storage.setItem(DeviceService.STORAGE_KEYS.privateKey, privateKey);
      }
    }

    this.setPrivateKey(privateKey);
  }

  public async reset(): Promise<void> {
    const privateKey = generateRandomPrivateKey();

    if (this.storage) {
      await this.storage.setItem(DeviceService.STORAGE_KEYS.privateKey, privateKey);
    }

    this.setPrivateKey(privateKey);
  }

  public async signPersonalMessage(message: string | Buffer): Promise<Buffer> {
    return signPersonalMessage(message, this.privateKey);
  }

  private setPrivateKey(privateKey: Buffer): void {
    this.privateKey = privateKey;
    this.publicKey = privateToPublicKey(privateKey);
    const address = publicKeyToAddress(this.publicKey);

    this.device$.next({
      address,
    });
  }
}
