import { BehaviorSubject } from 'rxjs';
import { ILogger, ILoggerConsole, ILoggerEvent } from './interfaces';

const stream$ = new BehaviorSubject<ILoggerEvent>(null);
const wrappedConsole: Partial<Console> = {
  info(...args: any[]): void {
    console.log(...args);
    stream$.next({
      args,
      type: 'info',
    });
  },
  error(...args: any[]): void {
    console.error(...args);
    stream$.next({
      args,
      type: 'error',
    });
  },
};

const wrapSync: ILogger['wrapSync'] = (label, fun) => {
  console.info(`// ${label}`);

  const log: ILoggerConsole['log'] = (key, data) => {
    if (data || data === null) {
      wrappedConsole.info(key, data);
    } else {
      wrappedConsole.info(key);
    }
    return data;
  };

  const error: ILoggerConsole['error'] = (err) => {
    wrappedConsole.error(err);
  };

  const wrapper = async () => {
    return Promise.resolve(fun({
      log,
      error,
    }));
  };

  wrapper()
    .catch(error);
};

export const logger: ILogger = {
  stream$,
  wrapSync,
};
