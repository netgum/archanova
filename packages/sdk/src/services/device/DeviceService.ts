import { generateRandomPrivateKey, privateKeyToAddress, signPersonalMessage } from '@netgum/utils';
import { IStorageService } from '../storage';
import { IDeviceService } from './interfaces';

export class DeviceService implements IDeviceService {
  public static STORAGE_KEYS = {
    privateKey: 'DeviceService/privateKey',
  };

  private privateKey: Buffer = null;

  constructor(
    private storageService: IStorageService,
  ) {
    //
  }

  public async setup(): Promise<string> {
    this.privateKey = await this.storageService.getItem<Buffer>(DeviceService.STORAGE_KEYS.privateKey);

    if (!this.privateKey) {
      this.privateKey = generateRandomPrivateKey();

      await this.storageService.setItem(DeviceService.STORAGE_KEYS.privateKey, this.privateKey);
    }

    return privateKeyToAddress(this.privateKey);
  }

  public async reset(): Promise<string> {
    this.privateKey = generateRandomPrivateKey();

    await this.storageService.setItem(DeviceService.STORAGE_KEYS.privateKey, this.privateKey);

    return privateKeyToAddress(this.privateKey);
  }

  public async signPersonalMessage(message: string | Buffer): Promise<Buffer> {
    return signPersonalMessage(message, this.privateKey);
  }
}
