import { Container, interfaces } from 'inversify';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, Middleware } from 'redux';
import { IEnvironment } from './environment';
import {
  AccountService,
  AccountProviderService,
  AccountProxyService,
  DeviceService,
  EnsService,
  EthService,
  LinkingService,
  NotificationService,
  SessionService,
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
import { IStorage } from './storage';
import { TYPES } from './constants';
import { ISdk } from './interfaces';
import { reduxActions } from './redux';

export class Sdk implements ISdk {

  private container = new Container({
    defaultScope: 'Singleton',
  });

  constructor(environment: IEnvironment, storage: IStorage = null) {

    // constants
    this.container.bind(TYPES.Storage).toConstantValue(storage || null);

    // services
    this.container.bind(TYPES.AccountService).to(AccountService);
    this.container.bind(TYPES.AccountProviderService).to(AccountProviderService);
    this.container.bind(TYPES.AccountProxyService).to(AccountProxyService);
    this.container.bind(TYPES.DeviceService).to(DeviceService);
    this.container.bind(TYPES.EnsService).to(EnsService);
    this.container.bind(TYPES.EthService).to(EthService);
    this.container.bind(TYPES.LinkingService).to(LinkingService);
    this.container.bind(TYPES.NotificationService).to(NotificationService);
    this.container.bind(TYPES.SessionService).to(SessionService);

    // services options
    this.container.bind(AccountService.TYPES.Options).toConstantValue(environment.getServiceOptions('account'));
    this.container.bind(AccountProviderService.TYPES.Options).toConstantValue(environment.getServiceOptions('accountProvider'));
    this.container.bind(AccountProxyService.TYPES.Options).toConstantValue(environment.getServiceOptions('accountProxy'));
    this.container.bind(EnsService.TYPES.Options).toConstantValue(environment.getServiceOptions('ens'));
    this.container.bind(EthService.TYPES.Options).toConstantValue(environment.getServiceOptions('eth'));
    this.container.bind(LinkingService.TYPES.Options).toConstantValue(environment.getServiceOptions('linking'));
    this.container.bind(NotificationService.TYPES.Options).toConstantValue(environment.getServiceOptions('notification'));
    this.container.bind(SessionService.TYPES.Options).toConstantValue(environment.getServiceOptions('session'));
  }

  public get storage(): IStorage {
    return this.getService(TYPES.Storage);
  }

  public get accountService(): IAccountService {
    return this.getService(TYPES.AccountService);
  }

  public get accountProviderService(): IAccountProviderService {
    return this.getService(TYPES.AccountProviderService);
  }

  public get accountProxyService(): IAccountProxyService {
    return this.getService(TYPES.AccountProxyService);
  }

  public get deviceService(): IDeviceService {
    return this.getService(TYPES.DeviceService);
  }

  public get ensService(): IEnsService {
    return this.getService(TYPES.EnsService);
  }

  public get ethService(): IEthService {
    return this.getService(TYPES.EthService);
  }

  public get linkingService(): ILinkingService {
    return this.getService(TYPES.LinkingService);
  }

  public get notificationService(): INotificationService {
    return this.getService(TYPES.NotificationService);
  }

  public get sessionService(): ISessionService {
    return this.getService(TYPES.SessionService);
  }

  public getService<T = any>(id: interfaces.ServiceIdentifier<T>): T {
    return this.container.get<T>(id);
  }

  public extend(callback: (bind: interfaces.Bind) => any): void {
    callback(
      this.container.bind.bind(this.container),
    );
  }

  public async setup(): Promise<void> {
    await this.deviceService.setup();
    await this.ethService.setup();
    await this.sessionService.create();
    await this.accountService.setup();
    await this.accountProviderService.setup();
    await this.linkingService.setup();
    await this.notificationService.setup();
  }

  public async reset(): Promise<void> {
    await this.deviceService.reset();
    await this.sessionService.reset();
    this.accountService.reset();
  }

  public createReduxMiddleware(): Middleware {
    return (store: Store) => {
      setTimeout(
        () => {
          merge(
            this.accountService.account$.pipe(map(reduxActions.setAccount)),
            this.accountService.accountBalance$.pipe(map(reduxActions.setAccountBalance)),
            this.accountService.accountDevice$.pipe(map(reduxActions.setAccountDevice)),
            this.accountProviderService.supportedEnsName$.pipe(map(reduxActions.setSupportedEnsName)),
            this.deviceService.device$.pipe(map(reduxActions.setDevice)),
            this.ethService.networkVersion$.pipe(map(reduxActions.setNetworkVersion)),
            this.notificationService.connected$.pipe(map(reduxActions.setOnline)),
          )
            .subscribe(store.dispatch);
        },
        0,
      );

      return next => action => next(action);
    };
  }
}
