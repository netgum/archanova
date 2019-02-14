import { interfaces } from 'inversify';
import { Middleware } from 'redux';
import { IStorage } from './storage';
import {
  IAccountService,
  IAccountProviderService,
  IAccountProxyService,
  IDeviceService,
  IEnsService,
  IEthService,
  ILinkingService,
  INotificationService,
  ISessionService,
} from './services';

export interface ISdk {
  readonly storage: IStorage;
  readonly accountService: IAccountService;
  readonly accountProviderService: IAccountProviderService;
  readonly accountProxyService: IAccountProxyService;
  readonly deviceService: IDeviceService;
  readonly ensService: IEnsService;
  readonly ethService: IEthService;
  readonly linkingService: ILinkingService;
  readonly notificationService: INotificationService;
  readonly sessionService: ISessionService;

  getService<T = any>(id: interfaces.ServiceIdentifier<T>): T;

  extend(callback: (bind: interfaces.Bind) => any): void;

  setup(): Promise<void>;

  reset(): Promise<void>;

  createReduxMiddleware(): Middleware;
}
