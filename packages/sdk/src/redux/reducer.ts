import { combineReducers } from 'redux';
import { Types } from './actions';

export function account(state = null, { type, payload }) {
  let result = state;

  switch (type) {
    case Types.SetAccount:
      result = payload;
      break;
  }

  return result;
}

export function accountBalance(state = null, { type, payload }) {
  let result = state;

  switch (type) {
    case Types.SetAccountBalance:
      result = payload;
      break;
  }

  return result;
}

export function accountDevice(state = null, { type, payload }) {
  let result = state;

  switch (type) {
    case Types.SetAccountDevice:
      result = payload;
      break;
  }

  return result;
}

export function device(state = null, { type, payload }) {
  let result = state;

  switch (type) {
    case Types.SetDevice:
      result = payload;
      break;
  }

  return result;
}

export function networkVersion(state = null, { type, payload }) {
  let result = state;

  switch (type) {
    case Types.SetNetworkVersion:
      result = payload;
      break;
  }

  return result;
}

export function online(state = null, { type, payload }) {
  let result = state;

  switch (type) {
    case Types.SetOnline:
      result = payload;
      break;
  }

  return result;
}

export function supportedEnsName(state = null, { type, payload }) {
  let result = state;

  switch (type) {
    case Types.SetSupportedEnsName:
      result = payload;
      break;
  }

  return result;
}

export default combineReducers({
  account,
  accountBalance,
  accountDevice,
  device,
  networkVersion,
  online,
  supportedEnsName,
}) as any;
