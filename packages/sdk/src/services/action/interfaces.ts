import { Subject } from 'rxjs';
import { ActionTypes } from './constants';

export interface IAction<T = any> {
  type: ActionTypes;
  payload: T;
  timestamp: number;
}

export interface IActionService {
  $incoming: Subject<IAction>;

  $accepted: Subject<IAction>;

  setup(): void;

  acceptAction(action?: IAction): void;

  dismissAction(): void;

  createAction<T = any>(type: ActionTypes, payload: T): IAction<T>;
}

export namespace IActionService {
  export interface IOptions {
    autoAccept?: boolean;
  }
}
