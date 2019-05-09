#!/usr/bin/env node

import { createSdk, createLocalEnvironment } from '@archanova/sdk';
import { render } from 'ink';
import React from 'react';
import Ws from 'ws';
import { App } from './App';
import { StorageAdapter } from './StorageAdapter';

console.clear();

(async () => {
  const sdk = createSdk(
    createLocalEnvironment()
      .setConfig('storageAdapter', new StorageAdapter())
      .setConfig('apiWebSocketConstructor', Ws),
  );

  await sdk.initialize();

  const {
    account,
    device,
    eth,
  } = sdk.state;

  console.log(await sdk.getConnectedAccounts());

  console.log();
  console.log('account:', account);
  console.log('device:', device);
  console.log('eth:', eth);

})()
  .catch(console.error);

render(<App />);
