import { Api } from './Api';
import { Eth } from './Eth';

export class Error extends global.Error {
  public static fromAny(err: any): Error {
    let result: Error = null;

    switch (typeof err) {
      case 'string':
        result = new Error(err);
        break;

      case 'object':
        if (err instanceof Error) {
          result = err;
        } else if (err instanceof Api.Error) {
          const { error, errors, message } = err;
          result = new Error(error || message, Error.Types.Http, errors, err);
        } else if (err instanceof Eth.Error) {
          const { message } = err;
          result = new Error(message, Error.Types.EthNode);
        } else if (err instanceof global.Error) {
          const { message } = err;
          result = new Error(message, undefined, err);
        }
    }

    return result;
  }

  public static throwFromAny(err: any): any {
    throw this.fromAny(err);
  }

  public static throwEthTransactionReverted(data?: any): any {
    throw new Error('reverted', Error.Types.EthTransaction, data);
  }

  private constructor(
    message: string = 'unknown',
    public readonly type: Error.Types = Error.Types.Internal,
    public readonly data?: any,
    public readonly origin?: any,
  ) {
    super(message);
  }

  public toRawObject(): {
    message: string;
    type: Error.Types;
    data: any;
  } {
    return {
      message: this.message,
      type: this.type,
      data: this.data || null,
    };
  }
}

export namespace Error {
  export enum Types {
    Internal = 'Internal',
    Http = 'Http',
    EthNode = 'EthNode',
    EthTransaction = 'EthTransaction',
  }
}
