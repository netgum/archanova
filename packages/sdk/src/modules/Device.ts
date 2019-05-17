import { generateRandomPrivateKey, privateKeyToAddress, signPersonalMessage, anyToBuffer, verifyPrivateKey } from '@netgum/utils';
import { State } from './State';
import { Storage } from './Storage';

export class Device {
  private privateKey: Buffer = null;

  constructor(
    private state: State,
    private storage: Storage,
  ) {
    //
  }

  public async setup(options: Device.ISetupOptions = {}): Promise<void> {
    if (options.privateKey) {
      const privateKey = anyToBuffer(options.privateKey, { defaults: null });
      if (verifyPrivateKey(privateKey)) {
        this.privateKey = privateKey;

        await this.storage.setItem(Device.StorageKeys.PrivateKey, this.privateKey);
      }
    }

    if (!this.privateKey) {
      this.privateKey = await this.storage.getItem<Buffer>(Device.StorageKeys.PrivateKey);
    }

    if (!this.privateKey) {
      await this.generatePrivateKey();
    }

    this.emitState();
  }

  public async reset(): Promise<void> {
    await this.generatePrivateKey();

    this.emitState();
  }

  public signPersonalMessage(message: string | Buffer): Buffer {
    return signPersonalMessage(message, this.privateKey);
  }

  private async generatePrivateKey(): Promise<void> {
    this.privateKey = generateRandomPrivateKey();

    await this.storage.setItem(Device.StorageKeys.PrivateKey, this.privateKey);
  }

  private emitState(): void {
    const address = privateKeyToAddress(this.privateKey);

    this.state.device$.next({
      address,
    });
  }
}

export namespace Device {
  export enum StorageKeys {
    PrivateKey = 'private_key',
  }

  export interface ISetupOptions {
    privateKey?: string | Buffer;
  }
}
