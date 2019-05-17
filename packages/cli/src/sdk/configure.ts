import { createLocalSdkEnvironment, SdkEnvironmentNames, getSdkEnvironment, sdkModules } from '@archanova/sdk';
import Ws from 'ws';
import { StorageAdapter } from './StorageAdapter';
import { ISdkOptions } from './interface';
import { Sdk } from './Sdk';

export async function configureSdk(options: ISdkOptions, workingPath: string): Promise<Sdk> {
  let sdkEnv: sdkModules.Environment = createLocalSdkEnvironment(options.localEnv);

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

  const sdk = new Sdk(
    sdkEnv
      .setConfig('storageAdapter', new StorageAdapter(workingPath))
      .setConfig('apiWebSocketConstructor', Ws),
  );

  await sdk.initialize({
    device: {
      privateKey: options.privateKey,
    },
  });

  return sdk;
}
