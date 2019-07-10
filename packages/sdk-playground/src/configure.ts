import {
  createSdk,
  Sdk,
  reduxSdkReducer,
  createReduxSdkMiddleware,
} from '@archanova/sdk';
import { applyMiddleware, createStore, Store, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filter } from 'rxjs/operators';
import { ILogger, buildSdkEnv } from './shared';
import { config } from './config';

export function configureSdk(logger: ILogger): Sdk {
  const sdk = createSdk(
    buildSdkEnv(config.sdkEnv),
  );

  sdk
    .event$
    .pipe(filter(value => !!value))
    .subscribe(event => console.log('sdk.event$', event));

  sdk
    .error$
    .pipe(filter(value => !!value))
    .subscribe(err => console.error('sdk.error$', err));

  if (config.autoInitializeSdk) {
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
