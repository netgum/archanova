import { combineReducers, Reducer } from 'redux';
import { ReduxSdkActionTypes } from './actions';
import { createReducer } from './helpers';

export const reduxSdkReducer = combineReducers({
  initialized: createReducer(ReduxSdkActionTypes.SetInitialized),
  connected: createReducer(ReduxSdkActionTypes.SetConnected),
  authenticated: createReducer(ReduxSdkActionTypes.SetAuthenticated),
  account: createReducer(ReduxSdkActionTypes.SetAccount),
  accountDevice: createReducer(ReduxSdkActionTypes.SetAccountDevice),
  accountFriendRecovery: createReducer(ReduxSdkActionTypes.SetAccountFriendRecovery),
  device: createReducer(ReduxSdkActionTypes.SetDevice),
  ens: createReducer(ReduxSdkActionTypes.SetEns),
  eth: createReducer(ReduxSdkActionTypes.SetEth),
  incomingAction: createReducer(ReduxSdkActionTypes.SetIncomingAction),
}) as any as Reducer;
