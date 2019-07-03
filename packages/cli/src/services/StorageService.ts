import { sdkModules } from '@archanova/sdk';
import { ensureDir, readFile, remove, writeFile } from 'fs-extra';
import { homedir } from 'os';
import { join } from 'path';
import { Scopes } from '../constants';

export class StorageService {
  private static FILE_PREFIX = '.archanova';
  private static CONFIG_FILE = 'config.json';

  private readonly scope: Scopes;
  private readonly localRootPath: string;
  private readonly globalRootPath: string;
  private namespace: string = null;

  constructor({ scope, workingPath }: StorageService.IOptions) {
    this.scope = scope;
    this.localRootPath = join(workingPath, StorageService.FILE_PREFIX);
    this.globalRootPath = join(homedir(), StorageService.FILE_PREFIX);
  }

  public setNamespace(namespace: string): void {
    this.namespace = namespace;
  }

  public toSdkAdapter(): sdkModules.Storage.IAdapter {
    return {
      getItem: async (key: string) => {
        const postfix = this.keyToPostfix(key);

        let result: string = null;

        if (postfix) {
          try {
            const path = await this.postfixToPath(postfix);
            result = await readFile(path, 'utf8');
          } catch (err) {
            //
          }
        }
        return result;
      },
      setItem: async (key: string, value: string) => {
        const postfix = this.keyToPostfix(key);

        if (postfix) {
          try {
            const path = await this.postfixToPath(postfix, true);
            await writeFile(path, value, 'utf8');
          } catch (err) {
            //
          }
        }
      },

      removeItem: async (key: string) => {
        const postfix = this.keyToPostfix(key);

        if (postfix) {
          try {
            const path = await this.postfixToPath(postfix);
            await remove(path);
          } catch (err) {
            //
          }
        }
      },
    };
  }

  private async postfixToPath(postfix: StorageService.KeyPostfixes, ensure: boolean = false): Promise<string> {
    let rootPath: string = null;
    switch (postfix) {
      case StorageService.KeyPostfixes.Account:
      case StorageService.KeyPostfixes.AccountDevice:
      case StorageService.KeyPostfixes.DevicePrivateKey:
        rootPath = this.scope === Scopes.Global ? this.globalRootPath : this.localRootPath;
        break;

      case StorageService.KeyPostfixes.App:
        rootPath = this.localRootPath;
        break;
    }

    if (rootPath) {
      if (ensure) {
        await ensureDir(rootPath);
      }
    }

    return rootPath ? join(rootPath, `${this.postfixToKey(postfix)}.json`) : null;
  }

  private keyToPostfix(key: string): StorageService.KeyPostfixes {
    let result: StorageService.KeyPostfixes;
    const type = key.substr(this.namespace.length + 1);

    switch (type) {
      case StorageService.KeyPostfixes.Account:
      case StorageService.KeyPostfixes.AccountDevice:
      case StorageService.KeyPostfixes.DevicePrivateKey:
      case StorageService.KeyPostfixes.App:
        result = type as any;
        break;
    }

    return result;
  }

  private postfixToKey(postfix: StorageService.KeyPostfixes): string {
    return `${this.namespace}:${postfix}`;
  }
}

export namespace StorageService {
  export interface IOptions {
    workingPath: string;
    scope: Scopes;
  }

  export enum KeyPostfixes {
    Account = 'account',
    AccountDevice = 'account_device',
    DevicePrivateKey = 'device:private_key',
    App = 'app',
  }
}
