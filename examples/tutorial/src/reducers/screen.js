import { actionTypes } from '../actions';

export function screen(state = null, { type, payload }) {
  switch (type) {
    case actionTypes.OPEN_SCREEN:
      return payload;

    default:
      return state;
  }
}
