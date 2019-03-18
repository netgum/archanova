import { AnyAction, combineReducers, Reducer } from 'redux';
import { ReduxActionTypes } from './constants';

function createReducer(type: ReduxActionTypes): Reducer {
  return (state = null, action: AnyAction) => {
    switch (action.type) {
      case type:
        return action.payload;
      default:
        return state;
    }
  };
}

export const reduxReducer = combineReducers({
  account: createReducer(ReduxActionTypes.SetAccount),
  accountBalance: createReducer(ReduxActionTypes.SetAccountBalance),
  accountDevice: createReducer(ReduxActionTypes.SetAccountDevice),
  deviceAddress: createReducer(ReduxActionTypes.SetDeviceAddress),
  gasPrice: createReducer(ReduxActionTypes.SetGasPrice),
  networkVersion: createReducer(ReduxActionTypes.SetNetworkVersion),
  initialized: createReducer(ReduxActionTypes.SetInitialized),
  authenticated: createReducer(ReduxActionTypes.SetAuthenticated),
  connected: createReducer(ReduxActionTypes.SetConnected),
  incomingAction: createReducer(ReduxActionTypes.SetIncomingAction),
}) as any;
