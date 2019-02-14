import { TActionCreator } from './types';

export function createActionCreator<T = any>(type: string): TActionCreator<T> {
  return (payload = null) => ({
    type,
    payload,
  });
}
