import { IAction } from './interfaces';

export type TActionCreator<T = any> = (payload?: T) => IAction<T>;
