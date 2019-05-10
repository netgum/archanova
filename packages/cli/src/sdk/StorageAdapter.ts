import { homedir } from 'os';
import { sdkModules } from '@archanova/sdk';
import { join } from 'path';
import { ensureDir, remove, writeFile, readFile } from 'fs-extra';

export class StorageAdapter implements sdkModules.Storage.IAdapter {
  private static ROOT_PATH = join(homedir(), '.archanova');

  public async getItem(key: string): Promise<string> {
    await this.prepareDir();

    const filePath = this.keyToPath(key);
    let result: string = null;
    try {
      result = await readFile(filePath, 'utf8');
    } catch (err) {
      //
    }
    return result;
  }

  public async setItem(key: string, value: string): Promise<void> {
    await this.prepareDir();

    const filePath = this.keyToPath(key);

    await writeFile(filePath, value, 'utf8');
  }

  public async removeItem(key: string): Promise<void> {
    const filePath = this.keyToPath(key);

    try {
      await remove(filePath);
    } catch (err) {
      //
    }
  }

  private prepareDir(): Promise<void> {
    return ensureDir(
      StorageAdapter.ROOT_PATH,
    );
  }

  private keyToPath(key: string): string {
    return join(
      StorageAdapter.ROOT_PATH,
      `${key}.json`,
    );
  }
}
