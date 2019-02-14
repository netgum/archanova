import { IPlatformService } from '../services';
import { Environment } from './Environment';
import { IEnvironment } from './interfaces';

export function buildEnvironment(options: Partial<IPlatformService.IOptions>): IEnvironment {
  const platformOptions: IPlatformService.IOptions = {
    host: 'localhost',
    useSsl: true,
    port: null,
    ...options,
  };

  const buildHost = service => `${service}.${platformOptions.host}`;

  return new Environment({
    account: {
      ...platformOptions,
      host: buildHost('account'),
    },
    accountProvider: {
      ...platformOptions,
      host: buildHost('account-provider'),
      contractAddress: null,
    },
    accountProxy: {
      ...platformOptions,
      host: buildHost('account-proxy'),
      contractAddress: null,
    },
    ens: {
      contractAddress: null,
    },
    eth: {
      ...platformOptions,
      host: buildHost('eth'),
      customProvider: null,
    },
    linking: {},
    notification: {
      ...platformOptions,
      host: buildHost('notification'),
    },
    session: {
      ...platformOptions,
      host: buildHost('session'),
    },
  });
}

export function buildLocalEnvironment(options: IEnvironment.IBuildLocalOptions): IEnvironment {
  const {
    platformHost,
    platformStartPort,
    ethProviderPort,
  } = {
    platformHost: 'localhost',
    platformStartPort: 4000,
    ethProviderPort: 8545,
    ...options,
  };

  const platform: IPlatformService.IOptions = {
    host: platformHost,
    useSsl: false,
    port: null,
  };

  return new Environment({
    account: {
      ...platform,
      port: platformStartPort + 10,
    },
    accountProvider: {
      ...platform,
      port: platformStartPort + 20,
      contractAddress: null,
    },
    accountProxy: {
      ...platform,
      port: platformStartPort + 30,
      contractAddress: null,
    },
    ens: {
      contractAddress: null,
    },
    eth: {
      ...platform,
      port: ethProviderPort || 8545,
      customProvider: null,
    },
    linking: {},
    notification: {
      ...platform,
      port: platformStartPort + 60,
    },
    session: {
      ...platform,
      port: platformStartPort + 70,
    },
  });
}
