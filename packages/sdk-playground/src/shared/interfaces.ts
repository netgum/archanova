import { Sdk } from '@archanova/sdk';
import { Subject } from 'rxjs';

export interface IContextProps {
  config: IConfig;
  sdk: Sdk;
  logger: ILogger;
  help: IHelp;
}

export interface IConfig {
  showHelp: boolean;
}

export interface IHelp {
  stream$: Subject<string>;

  show(alias: string): void;

  hide(): void;
}

export interface ILoggerConsole {
  log<T = any>(key: string, data?: T): T;

  error(err: any): void;
}

export interface ILogger {
  stream$: Subject<ILoggerEvent>;

  wrapSync<T = any>(label: string, fun: (console: ILoggerConsole) => Promise<T>): void;
}

export interface ILoggerEvent {
  type: 'info' | 'error';
  args: any[];
}
