#!/usr/bin/env node

import { sdkConstants } from '@archanova/sdk';
import { render } from 'ink';
import { join } from 'path';
import { copy } from 'fs-extra';
import React from 'react';
import { App } from './App';
import config from './config';
import { configureSdk } from './sdk';
import { configureServer } from './server';

console.clear();
console.log('Please wait ...');

(async () => {
  const sdk = await configureSdk(config.sdk, config.workingPath);
  const server = configureServer();

  {
    const { accountAddress } = sdk.state;
    if (!accountAddress) {
      const { items } = await sdk.getConnectedAccounts();

      if (items.length) {
        const [{ address }] = items;
        await sdk.connectAccount(address);
      } else {
        await sdk.createAccount();
      }
    }
  }

  const { account } = sdk.state;
  if (
    account.type !== sdkConstants.AccountTypes.Developer
  ) {
    if (
      !config.invitationCode ||
      !await sdk.becomeDeveloper(config.invitationCode).catch(() => null)
    ) {
      console.clear();
      console.log('Account not in Archanova Developer program');
      console.log('Please use --invitation-code');
      process.exit();
    }
  }

  let app = await sdk.getDeveloperApp();

  if (config.appName) {
    if (app) {
      console.log('Application already created');
      process.exit();
    }

    app = await sdk.createDeveloperApp(config.appName).catch(() => null);

    if (app) {
      await Promise.all([
        'index.js',
        'index.d.ts',
      ].map(fileName => copy(
        join(__dirname, '..', 'template', fileName),
        join(config.workingPath, fileName),
      )));
    } else {
      console.log(`Can not create app with name ${config.appName}`);
      process.exit();
    }
  }

  if (!app) {
    console.log('App not created');
    console.log('Please use --create-app');
    process.exit();
  }

  const callbackUrl = await server.start(`${config.workingPath}/index.js`);

  await sdk.updateDeveloperApp(app.alias, callbackUrl);

  console.clear();

  render(
    <App
      account={sdk.state.account}
      appAlias={app.alias}
      url={callbackUrl}
    />,
  );
})()
  .catch(console.error);
