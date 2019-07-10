import { Sdk } from '@archanova/sdk';
import { BehaviorSubject, Subject } from 'rxjs';
import { config } from '../config';

export interface IContextProps {
  config: typeof config;
  sdk: Sdk;
  logger: ILogger;
  help: IHelp;
}

export interface IHelp {
  stream$: BehaviorSubject<string>;

  show(alias: string): void;

  hide(): void;
}

export interface ILoggerConsole {
  log<T = any>(key: string, data?: T): T;

  error(err: any): void;
}

export interface ILogger {
  stream$: Subject<ILoggerEvent>;
  pending$: Subject<boolean>;

  wrapSync<T = any>(label: string, fun: (console: ILoggerConsole) => Promise<T>): void;
}

export interface ILoggerEvent {
  type: 'info' | 'error';
  args: any[];
}
