#!/usr/bin/env node

import { createReduxSdkMiddleware } from '@archanova/sdk';
import { render } from 'ink';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { configureSdk } from './sdk';
import App from './App';
import reducers from './reducers';
import config from './config';

const sdk = configureSdk({
  env: config.env,
  localEnv: {
    host: config.localEnvHost,
  },
  storage: config.storage,
});

console.clear();
console.log('Please wait ...');

(async () => {
  await sdk.initialize();

  const store = createStore(
    reducers,
    {},
    applyMiddleware(
      createReduxSdkMiddleware(sdk),
    ),
  );

  console.clear();

  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
})()
  .catch(console.error);
