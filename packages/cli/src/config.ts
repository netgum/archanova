import commander from 'commander';
import { anyToBuffer } from '@netgum/utils';
import { ISdkOptions } from './sdk';
import { resolve } from 'path';

interface ICommander {
  env: any;
  localEnvHost: string;
  localEnvPort: string;
  privateKey: string;
  appName: string;
  invitationCode: string;
  createApp: string;
}

export interface IConfig {
  sdk: ISdkOptions;
  workingPath: string;
  invitationCode: string;
  appName: string;
}

let workingPath = process.cwd();

const {
  env,
  localEnvHost,
  localEnvPort,
  privateKey,
  invitationCode,
  createApp,
} = commander
  .arguments('[workingPath]')
  .option('-e --env <env>', 'environment [ropsten,rinkeby,kovan,local]', /^(kovan|rinkeby|ropsten|local)$/i, 'kovan')
  .option('--local-env-host <host>', 'local env host')
  .option('--local-env-port <port>', 'local env port')
  .option('--private-key <key>', 'device private key')
  .option('--invitation-code <code>', 'developer invitation code')
  .option('--create-app <name>', 'create app with name')
  .action((arg) => {
    if (arg) {
      workingPath = resolve(arg);
    }
  })
  .parse(process.argv) as any as ICommander;

const config: IConfig = {
  workingPath,
  invitationCode,
  appName: createApp,
  sdk: {
    env,
    localEnv: {
      host: localEnvHost || null,
      port: parseInt(localEnvPort, 10) || null,
    },
    privateKey: anyToBuffer(privateKey, { defaults: null }),
  },
};

export default config;
