import { IEnvironment, Environment, availableEnvironments } from './environment';
import {
  AccountProviderService,
  AccountProxyService,
  AccountService,
  ActionService,
  ApiService,
  DeviceService,
  EventService,
  EthService,
  FaucetService,
  SecureService,
  SessionService,
  StorageService,
  UrlService,
} from './services';
import { State } from './state';
import { ISdk } from './interfaces';
import { Sdk } from './Sdk';

export function createSdk(env: IEnvironment | 'staging' = 'staging'): ISdk {
  let result: ISdk = null;

  let environment: IEnvironment = null;

  switch (env) {
    case 'staging':
      environment = availableEnvironments.staging;
      break;

    default:
      if (env instanceof Environment) {
        environment = env;
      }
  }

  if (environment) {
    const apiService = new ApiService(environment.getOptions('api'));
    const storageService = new StorageService(environment.getOptions('storage'));
    const state = new State(storageService);
    const accountService = new AccountService(apiService);
    const deviceService = new DeviceService(storageService);
    const accountProviderService = new AccountProviderService(environment.getOptions('accountProvider'), apiService);
    const accountProxyService = new AccountProxyService(environment.getOptions('accountProxy'), apiService, deviceService);
    const actionService = new ActionService(environment.getOptions('action'));
    const ethService = new EthService(environment.getOptions('eth'));
    const eventService = new EventService(state, apiService);
    const faucetService = new FaucetService(apiService);
    const secureService = new SecureService(apiService, deviceService);
    const sessionService = new SessionService(apiService, deviceService);
    const urlService = new UrlService(environment.getOptions('url'), actionService);

    result = new Sdk(
      state,
      accountService,
      accountProviderService,
      accountProxyService,
      actionService,
      apiService,
      deviceService,
      ethService,
      eventService,
      faucetService,
      secureService,
      sessionService,
      storageService,
      urlService,
    );
  }

  return result;
}
