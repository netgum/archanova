export class EthError extends Error {
  public static isEthError(err: any): boolean {
    return (
      typeof err === 'object' &&
      err &&
      err instanceof this
    );
  }

  constructor(public httpError: any = null) {
    super('unknown');
  }
}
