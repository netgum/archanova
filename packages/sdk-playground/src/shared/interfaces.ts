import { Sdk } from '@archanova/sdk';
import { BehaviorSubject, Subject } from 'rxjs';

export interface IContextProps {
  sdk: Sdk;
  logger: ILogger;
  help: IHelp;
}

export interface IHelp {
  active$: BehaviorSubject<boolean>;
  stream$: BehaviorSubject<string>;

  show(alias: string): void;

  hide(): void;
  toggle(): void;
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
