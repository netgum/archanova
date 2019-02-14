export class EthError extends Error {
  constructor(public error: any = null) {
    super('EthError');
  }
}
