import { jsonReviver, jsonReplacer } from '@netgum/utils';

export class Storage {
  static SEPARATOR = ':';

  constructor(
    private options: Storage.IOptions,
    private adapter: Storage.IAdapter = null,
  ) {
    //
  }

  public createChild(namespace: string): Storage {
    return new Storage({
      namespace: this.prepareKey(namespace),
    }, this.adapter);
  }

  public async getItem<T = any>(key: string | string[]): Promise<T> {
    let result: T = null;

    if (this.adapter) {
      try {
        const adapterKey = this.prepareKey(key);
        const raw: string = await Promise.resolve(this.adapter.getItem(adapterKey));

        if (raw) {
          result = JSON.parse(raw, jsonReviver);
        }
      } catch (err) {
        result = null;
      }
    }

    return result || null;
  }

  public async setItem<T = any>(key: string | string[], item: T): Promise<void> {
    if (!item) {
      return this.removeItem(key);
    }

    if (this.adapter) {
      try {
        const adapterKey = this.prepareKey(key);
        const raw = JSON.stringify(item, jsonReplacer);
        await Promise.resolve(this.adapter.setItem(adapterKey, raw));
      } catch (err) {
        //
      }
    }
  }

  public async removeItem(key: string | string[]): Promise<void> {
    if (this.adapter) {
      try {
        const adapterKey = this.prepareKey(key);
        await Promise.resolve(this.adapter.removeItem(adapterKey));
      } catch (err) {
        //
      }
    }
  }

  private prepareKey(key: string | string[]): string {
    const { namespace } = this.options;

    let parts: string[] = Array.isArray(key)
      ? key
      : [key];

    if (namespace) {
      parts = [
        namespace,
        ...parts,
      ];
    }

    return parts.join(Storage.SEPARATOR);
  }
}

export namespace Storage {
  export interface IOptions {
    namespace?: string;
  }

  export interface IAdapter {
    getItem(key: string): string | Promise<string>;

    setItem(key: string, value: string): void | Promise<void>;

    removeItem(key: string): void | Promise<void>;
  }
}
