export interface IStorage {
  getItem<T = any>(key: string): Promise<T>;

  setItem<T = any>(key: string, item: T): Promise<void>;

  removeItem(key: string): Promise<void>;
}
