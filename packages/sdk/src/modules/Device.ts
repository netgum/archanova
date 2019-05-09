import { generateRandomPrivateKey, privateKeyToAddress, signPersonalMessage } from '@netgum/utils';
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

  public async setup(): Promise<void> {
    this.privateKey = await this.storage.getItem<Buffer>(Device.StorageKeys.PrivateKey);

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
    PrivateKey = 'privateKey',
  }
}
