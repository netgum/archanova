import { createLocalSdkEnvironment, SdkEnvironmentNames, getSdkEnvironment, Sdk, sdkModules, createSdk } from '@archanova/sdk';
import Ws from 'ws';
import { StorageAdapter } from './StorageAdapter';

export function configureSdk(options: {
  env: string,
  localEnv: {
    host: string;
  };
  storage: boolean;
}): Sdk {
  let sdkEnv: sdkModules.Environment = createLocalSdkEnvironment({
    host: options.localEnv.host,
  });

  switch (options.env) {
    case 'ropsten':
      sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Ropsten);
      break;

    case 'rinkeby':
      sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Rinkeby);
      break;

    case 'kovan':
      sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Kovan);
      break;
  }

  const storageAdapter: sdkModules.Storage.IAdapter = options.storage
    ? new StorageAdapter()
    : null;

  return createSdk(
    sdkEnv
      .setConfig('storageAdapter', storageAdapter)
      .setConfig('apiWebSocketConstructor', Ws),
  );
}
