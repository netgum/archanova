import { OPEN_SCREEN } from './types';

export function openScreen(payload) {
  return {
    type: OPEN_SCREEN,
    payload,
  };
}
