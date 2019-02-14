# Storage Interface

```typescript
interface IStorage {
  getItem<T = any>(key: string): Promise<T>;

  setItem<T = any>(key: string, item: T): Promise<void>;

  removeItem(key: string): Promise<void>;
}
```

## as `localStorage` wrapper

```javascript
import { jsonReplacer, jsonReviver } from '@netgum/utils';

const storage = {
  getItem(key) {
    let item = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        item = JSON.parse(raw, jsonReviver);
      }
    } catch (err) {
      item = null;
    }
    return Promise.resolve<T>(item || null);
  },
  setItem(key, item) {
    if (!item) {
      localStorage.removeItem(key);
    } else {
      const raw = JSON.stringify(item, jsonReplacer);
      localStorage.setItem(key, raw);
    }
    return Promise.resolve();
  },
  removeItem(key) {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

```
