import { IBN } from 'bn.js';
import {
  IAccount,
  IAccountDevice,
  IDevice,
} from '../../services';
import { Types } from './constants';
import { createActionCreator } from './helpers';
import { TActionCreator } from './types';

export const setAccount: TActionCreator<IAccount> = createActionCreator(Types.SetAccount);
export const setAccountBalance: TActionCreator<IBN> = createActionCreator(Types.SetAccountBalance);
export const setAccountDevice: TActionCreator<IAccountDevice> = createActionCreator(Types.SetAccountDevice);
export const setDevice: TActionCreator<IDevice> = createActionCreator(Types.SetDevice);
export const setNetworkVersion: TActionCreator<string> = createActionCreator(Types.SetNetworkVersion);
export const setOnline: TActionCreator<boolean> = createActionCreator(Types.SetOnline);
export const setSupportedEnsName: TActionCreator<string> = createActionCreator(Types.SetSupportedEnsName);
