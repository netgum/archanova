import { AnyAction, Reducer } from 'redux';
import { ReduxSdkActionTypes } from './actions';

export function createActionCreator(type: ReduxSdkActionTypes): (payload: any) => any {
  return payload => ({
    type,
    payload,
  });
}

export function createReducer(type: ReduxSdkActionTypes): Reducer {
  return (state = null, action: AnyAction) => {
    return action.type === type
      ? action.payload
      : state;
  };
}
