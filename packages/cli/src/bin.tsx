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

if (config.env === 'local') {
  sdkEnv = createLocalSdkEnvironment({
    ...config.localEnv,
  });
}

if (!sdkEnv) {
  sdkEnv = getSdkEnvironment(config.env as any) || getSdkEnvironment(SdkEnvironmentNames.Main);
}

const storageService = new StorageService({
  scope: config.scope,
  workingPath: config.workingPath,
});

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
