import { jsonReviver, jsonReplacer } from '@netgum/utils';
import { IStorageService } from './interfaces';

export class StorageService implements IStorageService {
  constructor(private options: IStorageService.IOptions = {}) {
    //
  }

  public async getItem<T = any>(key: string): Promise<T> {
    let result: T = null;

    const { adapter } = this.options;

    if (adapter) {
      try {
        const raw: string = await Promise.resolve(
          adapter.getItem(this.buildKey(key)),
        );
        if (raw) {
          result = JSON.parse(raw, jsonReviver);
        }
      } catch (err) {
        result = null;
      }
    }

    return result || null;
  }

  public async setItem<T = any>(key: string, item: T): Promise<void> {
    if (!item) {
      return this.removeItem(key);
    }

    const { adapter } = this.options;

    if (adapter) {
      try {
        const raw = JSON.stringify(item, jsonReplacer);
        await Promise.resolve(
          adapter.setItem(this.buildKey(key), raw),
        );
      } catch (err) {
        //
      }
    }
  }

  public async removeItem(key: string): Promise<void> {
    const { adapter } = this.options;

    if (adapter) {
      try {
        await Promise.resolve(
          adapter.removeItem(this.buildKey(key)),
        );
      } catch (err) {
        //
      }
    }
  }

  private buildKey(key: string): string {
    const { namespace } = this.options;

    return namespace
      ? `${namespace}/${key}`
      : key;
  }
}
