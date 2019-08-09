import { Error } from './modules/Error';

export const ERR_SDK_NOT_INITIALIZED = Error.fromAny('sdk not initialized');
export const ERR_SDK_ALREADY_INITIALIZED = Error.fromAny('sdk already initialized');
export const ERR_ACCOUNT_DISCONNECTED = Error.fromAny('account disconnected');
export const ERR_ACCOUNT_ALREADY_CONNECTED = Error.fromAny('account already connected');
export const ERR_INVALID_ACCOUNT_STATE = Error.fromAny('invalid account state');
export const ERR_INVALID_ACCOUNT_DEVICE_STATE = Error.fromAny('invalid account device state');
export const ERR_INVALID_ACCOUNT_DEVICE_TYPE = Error.fromAny('invalid account device type');
export const ERR_WRONG_NUMBER_OF_ARGUMENTS = Error.fromAny('wrong number of arguments');
export const ERR_INVALID_GAME_CREATOR = Error.fromAny('invalid game creator');
export const ERR_INVALID_GAME_STATE = Error.fromAny('invalid game state');
