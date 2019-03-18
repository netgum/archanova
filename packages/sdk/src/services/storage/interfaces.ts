export interface IStorageService {
  getItem<T = any>(key: string): Promise<T>;

  setItem<T = any>(key: string, item: T): Promise<void>;

  removeItem(key: string): Promise<void>;
}

export namespace IStorageService {
  export interface IOptions {
    namespace?: string;
    adapter?: IAdapter;
  }

  export interface IAdapter {
    getItem(key: string): string | Promise<string>;

    setItem(key: string, value: string): void | Promise<void>;

    removeItem(key: string): void | Promise<void>;
  }
}
