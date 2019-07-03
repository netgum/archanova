export interface ILogger {
  info(name: string, ...args: any[]): void;

  error(name: string, err: any): void;
}

const logger: ILogger;

export = logger;
