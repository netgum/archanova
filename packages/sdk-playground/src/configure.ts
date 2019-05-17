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

const {
  REACT_APP_SDK_ENV,
  REACT_APP_SDK_LOCAL_ENV_HOST,
  REACT_APP_SDK_LOCAL_ENV_PORT,
  REACT_APP_SDK_AUTO_INITIALIZE,
  REACT_APP_SDK_AUTO_ACCEPT_ACTION,
} = process.env;

export function configureSdk(logger: ILogger): Sdk {
  let sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Kovan); // kovan env by default

  switch (REACT_APP_SDK_ENV) {
    case SdkEnvironmentNames.Rinkeby:
    case SdkEnvironmentNames.Ropsten:
    case SdkEnvironmentNames.Kovan:
      sdkEnv = getSdkEnvironment(REACT_APP_SDK_ENV as SdkEnvironmentNames);
      break;

    case 'local':
      sdkEnv = createLocalSdkEnvironment({
        host: REACT_APP_SDK_LOCAL_ENV_HOST || null,
        port: parseInt(REACT_APP_SDK_LOCAL_ENV_PORT, 10) || null,
      });
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
        autoAccept: !!parseInt(REACT_APP_SDK_AUTO_ACCEPT_ACTION || '1', 10),
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

  if (parseInt(REACT_APP_SDK_AUTO_INITIALIZE || '1', 10)) {
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
