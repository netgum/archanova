import { SdkEnvironmentNames } from '@archanova/sdk';
import { Actions, Scopes } from './constants';

export interface IConfig {
  action?: Actions;
  scope: Scopes;
  env: SdkEnvironmentNames | 'local';
  localEnv: {
    host: string;
    port: number;
  };
  workingPath?: string;
  showHelp?: boolean;
  privateKey?: Buffer;
}
