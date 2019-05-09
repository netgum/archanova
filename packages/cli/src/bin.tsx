#!/usr/bin/env node

import { createLocalEnvironment, createReduxSdkMiddleware, createSdk, EnvironmentNames, getEnvironment, sdkModules } from '@archanova/sdk';
import { render } from 'ink';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import Ws from 'ws';
import App from './App';
import reducers from './reducers';
import { StorageAdapter } from './StorageAdapter';

console.clear();

(async () => {
  const env: string = 'rinkeby'; // 'local' | 'kovan' | 'rinkeby'

  let sdkEnv: sdkModules.Environment = createLocalEnvironment();

  switch (env) {

    case 'kovan':
      sdkEnv = getEnvironment(EnvironmentNames.Kovan);
      break;

    case 'rinkeby':
      sdkEnv = getEnvironment(EnvironmentNames.Rinkeby);
      break;
  }

  const sdk = createSdk(
    sdkEnv
      .setConfig('storageAdapter', new StorageAdapter(env))
      .setConfig('apiWebSocketConstructor', Ws),
  );

  await sdk.initialize();

  const store = createStore(
    reducers,
    {},
    applyMiddleware(
      createReduxSdkMiddleware(sdk),
    ),
  );

  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
})()
  .catch(console.error);
