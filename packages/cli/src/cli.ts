import { SdkEnvironmentNames } from '@archanova/sdk';
import { anyToBuffer, verifyPrivateKey } from '@netgum/utils';
import meow from 'meow';
import { resolve } from 'path';
import { Actions, Scopes } from './constants';
import { IConfig } from './interfaces';

const { input: inputs, flags }: {
  input: string[];
  flags: {
    env: SdkEnvironmentNames | 'local';
    global: boolean;
    help: boolean;
    localEnvHost: string;
    localEnvPort: string;
    privateKey: string;
  };
} = meow({
  booleanDefault: false,
  autoHelp: false,
  autoVersion: false,
  flags: {
    env: {
      type: 'string',
      alias: 'e',
      default: SdkEnvironmentNames.Kovan,
    },
    global: {
      type: 'boolean',
      alias: 'g',
    },
    help: {
      type: 'boolean',
      alias: 'h',
    },
    localEnvHost: {
      type: 'string',
      default: null,
    },
    localEnvPort: {
      type: 'string',
      default: null,
    },
    privateKey: {
      type: 'string',
      default: null,
    },
  },
});

const supportedEnvs = [...Object.values(SdkEnvironmentNames), 'local'];
const supportedActions = Object.values(Actions);

/**
 * gets cli config
 * @return IConfig
 */
export function getCliConfig(): IConfig {
  const privateKey: Buffer = anyToBuffer(flags.privateKey, { defaults: null });
  let action: Actions = null;
  let workingPath = process.cwd();

  for (const input of inputs) {
    if (supportedActions.includes(input)) {
      action = input as any;
    } else {
      if (
        input.startsWith('/') ||
        input.startsWith('.')
      ) {
        workingPath = resolve(input);
      }
      break;
    }
  }

  if (!supportedEnvs.includes(flags.env)) {
    throw new Error('Unsupported env'); // TODO: add error handler
  }

  if (privateKey && !verifyPrivateKey(privateKey)) {
    throw new Error('Invalid private key'); // TODO: add error handler
  }

  return {
    action,
    privateKey,
    workingPath,
    scope: flags.global ? Scopes.Global : Scopes.Local,
    env: flags.env,
    localEnv: {
      host: flags.localEnvHost,
      port: parseInt(flags.localEnvPort, 10) || null,
    },
    showHelp: !action || flags.help,
  };
}
