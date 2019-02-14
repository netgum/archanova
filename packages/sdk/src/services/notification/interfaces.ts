import { Subject } from 'rxjs';
import { TUniqueBehaviorSubject } from 'rxjs-addons';
import { IPlatformService } from '../platform';
import { NotificationEventTypes } from './constants';

export interface INotificationService extends IPlatformService {
  connected$: TUniqueBehaviorSubject<boolean>;
  connected: boolean;
  event$: Subject<INotificationService.IEvent>;

  setup(): void;
}

export namespace INotificationService {
  export interface IEvent<T = any> {
    type: NotificationEventTypes;
    payload: T;
  }

  export interface IAccountDeviceEventPayload {
    accountAddress: string;
    deviceAddress: string;
  }
}
