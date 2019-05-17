import { Sdk } from '@archanova/sdk';
import { Subject } from 'rxjs';

export interface IContextProps {
  sdk: Sdk;
  logger: ILogger;
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
