import { Subject } from 'rxjs';
import { EventTypes } from './constants';

export interface IEventService {
  $incoming: Subject<IEvent>;

  setup(): Subject<boolean>;
}

export interface IEvent<T = any> {
  type: EventTypes;
  payload: T;
}
