#!/usr/bin/env node

import { createLocalSdkEnvironment, getSdkEnvironment, SdkEnvironmentNames, sdkModules } from '@archanova/sdk';
import { render } from 'ink';
import React from 'react';
import Ws from 'ws';
import { getCliConfig } from './cli';
import context from './context';
import { Main } from './Main';
import { SdkService, ServerService, StorageService, TemplateService } from './services';

const config = getCliConfig();

let sdkEnv: sdkModules.Environment;

const storageService = new StorageService({
  scope: config.scope,
  workingPath: config.workingPath,
});

switch (config.env) {
  case SdkEnvironmentNames.Kovan:
  case SdkEnvironmentNames.Rinkeby:
  case SdkEnvironmentNames.Ropsten:
    sdkEnv = getSdkEnvironment(config.env);
    break;

  case 'local':
    sdkEnv = createLocalSdkEnvironment({
      ...config.localEnv,
    });
    break;
}

storageService.setNamespace(sdkEnv.getConfig('storageOptions').namespace);

const sdkService = new SdkService(
  sdkEnv
    .setConfig('storageAdapter', storageService.toSdkAdapter())
    .setConfig('apiWebSocketConstructor', Ws),
);

const serverService = new ServerService(config.workingPath);
const templateService = new TemplateService(config.workingPath);

render(
  <context.Provider
    value={{
      config,
      sdkService,
      storageService,
      serverService,
      templateService,
    }}
  >
    <Main />
  </context.Provider>,
);
