import { createLocalEnvironment, EnvironmentNames, getEnvironment, Sdk, sdkModules, createSdk } from '@archanova/sdk';
import Ws from 'ws';
import { StorageAdapter } from './StorageAdapter';

export function configureSdk(options: {
  env: string,
  localEnv: {
    host: string;
  };
  storage: {
    rootPath: string;
  }
}): Sdk {
  let sdkEnv: sdkModules.Environment = createLocalEnvironment(options.localEnv.host);

  switch (options.env) {
    case 'kovan':
      sdkEnv = getEnvironment(EnvironmentNames.Kovan);
      break;

    case 'rinkeby':
      sdkEnv = getEnvironment(EnvironmentNames.Rinkeby);
      break;
  }

  const storageAdapter: sdkModules.Storage.IAdapter = options.storage
    ? new StorageAdapter(
      options.env,
      options.storage.rootPath,
    )
    : null;

  return createSdk(
    sdkEnv
      .setConfig('storageAdapter', storageAdapter)
      .setConfig('apiWebSocketConstructor', Ws),
  );
}
