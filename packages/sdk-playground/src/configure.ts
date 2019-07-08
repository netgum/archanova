import {
  getSdkEnvironment,
  SdkEnvironmentNames,
  createLocalSdkEnvironment,
  sdkModules,
  createSdk,
  Sdk,
  reduxSdkReducer,
  createReduxSdkMiddleware,
} from '@archanova/sdk';
import { applyMiddleware, createStore, Store, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filter } from 'rxjs/operators';
import { ILogger } from './shared';
import { config } from './config';

export function configureSdk(logger: ILogger): Sdk {
  let sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Kovan); // kovan env by default

  switch (config.sdk.env) {
    case SdkEnvironmentNames.Rinkeby:
    case SdkEnvironmentNames.Ropsten:
    case SdkEnvironmentNames.Kovan:
    case SdkEnvironmentNames.Sokol:
      sdkEnv = getSdkEnvironment(config.sdk.env as SdkEnvironmentNames);
      break;

    case 'local':
      sdkEnv = createLocalSdkEnvironment(config.sdk.localEnv);
      break;
  }

  const sdk = createSdk(
    sdkEnv
      .setConfig('storageAdapter', localStorage as sdkModules.Storage.IAdapter)
      .setConfig('urlAdapter', {
        open(url: string): any {
          document.location = url as any;
        },
        addListener(listener: (url: string) => any): void {
          listener(document.location.toString());
        },
      })
      .extendConfig('actionOptions', {
        autoAccept: config.sdk.autoAcceptAction,
      }),
  );

  sdk
    .event$
    .pipe(filter(value => !!value))
    .subscribe(event => console.log('sdk.event$', event));
  sdk
    .error$
    .pipe(filter(value => !!value))
    .subscribe(err => console.error('sdk.error$', err));

  if (config.sdk.autoInitialize) {
    logger
      .wrapSync('sdk.initialize', async (console) => {
        await sdk.initialize();
        console.log('initialized');
      });
  }

  return sdk;
}

export function configureStore(sdk: Sdk): Store<any> {
  return createStore(
    combineReducers({
      sdk: reduxSdkReducer,
    }),
    {},
    composeWithDevTools(applyMiddleware(
      createReduxSdkMiddleware(sdk),
    )),
  );
}
