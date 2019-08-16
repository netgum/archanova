import { SdkError } from './SdkError';

export const ERR_SDK_NOT_INITIALIZED = SdkError.fromAny('sdk not initialized');
export const ERR_SDK_ALREADY_INITIALIZED = SdkError.fromAny('sdk already initialized');
export const ERR_ACCOUNT_DISCONNECTED = SdkError.fromAny('account disconnected');
export const ERR_ACCOUNT_ALREADY_CONNECTED = SdkError.fromAny('account already connected');
export const ERR_INVALID_ACCOUNT_STATE = SdkError.fromAny('invalid account state');
export const ERR_INVALID_ACCOUNT_DEVICE_STATE = SdkError.fromAny('invalid account device state');
export const ERR_INVALID_ACCOUNT_DEVICE_TYPE = SdkError.fromAny('invalid account device type');
export const ERR_WRONG_NUMBER_OF_ARGUMENTS = SdkError.fromAny('wrong number of arguments');
export const ERR_INVALID_GAME_CREATOR = SdkError.fromAny('invalid game creator');
export const ERR_INVALID_GAME_STATE = SdkError.fromAny('invalid game state');
export const ERR_EXTENSION_ALREADY_ADDED = SdkError.fromAny('extension already added');
export const ERR_EXTENSION_NOT_ADDED = SdkError.fromAny('extension not added');
export const ERR_ADDING_EXTENSION_IN_PROGRESS = SdkError.fromAny('adding extension in progress');
export const ERR_NOT_ENOUGH_REAL_FUNDS = SdkError.fromAny('not enough real funds');
export const ERR_NOT_ENOUGH_VIRTUAL_FUNDS = SdkError.fromAny('not enough virtual funds');
