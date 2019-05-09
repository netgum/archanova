import { sdkModules } from '@archanova/sdk';
import { sha3 } from '@netgum/utils';
import { resolve, join } from 'path';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

const ROOT_PATH = resolve(__dirname, '../demo/data');

export class StorageAdapter implements sdkModules.Storage.IAdapter {
  constructor(private namespace: string) {
    //
  }

  public async getItem(key: string): Promise<string> {
    const filePath = this.keyToPath(key);
    let result: string = null;
    try {
      result = readFileSync(filePath, 'utf8');
    } catch (err) {
      //
    }
    return result;
  }

  public async setItem(key: string, value: string): Promise<void> {
    const filePath = this.keyToPath(key);

    writeFileSync(filePath, value, 'utf8');
  }

  public async removeItem(key: string): Promise<void> {
    const filePath = this.keyToPath(key);

    try {
      unlinkSync(filePath);
    } catch (err) {
      //
    }
  }

  private keyToPath(key: string): string {
    return join(ROOT_PATH, `${sha3(this.namespace + key).toString('hex')}.json`);
  }
}
