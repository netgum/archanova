import { IBN } from 'bn.js';
import { Middleware } from 'redux';
import { IState } from './state';
import { IAccount, IAccountDevice, IFaucetService, IAccountTransaction, IAccountProxyService } from './services';

export interface ISdk {
  readonly state: IState;

  initialize(): Promise<void>;

  reset(options?: { device?: boolean, session?: boolean }): void;

  getGasPrice(): Promise<IBN>;

  getNetworkVersion(): Promise<string>;

  getAccounts(): Promise<IAccount[]>;

  createAccount(ensLabel?: string): Promise<IAccount>;

  setAccountEnsLabel(ensLabel?: string): Promise<IAccount>;

  connectAccount(accountAddress: string): Promise<IAccount>;

  verifyAccount(): Promise<IAccount>;

  disconnectAccount(): Promise<void>;

  topUpAccount(): Promise<IFaucetService.IReceipt>;

  getAccountDevices(): Promise<IAccountDevice[]>;

  createAccountDevice(deviceAddress: string): Promise<IAccountDevice>;

  removeAccountDevice(deviceAddress: string): Promise<void>;

  getAccountTransactions(): Promise<IAccountTransaction[]>;

  estimateAccountDeployment(gasPrice: IBN): Promise<IBN>;

  estimateAccountDeviceDeployment(deviceAddress: string, gasPrice: IBN): Promise<IAccountProxyService.IEstimatedTransaction>;

  estimateAccountTransaction(
    to: string,
    value: IBN,
    data: Buffer,
    gasPrice: IBN,
  ): Promise<IAccountProxyService.IEstimatedTransaction>;

  deployAccount(gasPrice: IBN): Promise<string>;

  deployAccountDevice(
    deviceAddress: string,
    estimated: IAccountProxyService.IEstimatedTransaction,
    gasPrice: IBN,
  ): Promise<string>;

  executeAccountTransaction(
    estimated: IAccountProxyService.IEstimatedTransaction,
    gasPrice: IBN,
  ): Promise<string>;

  acceptIncomingAction(): void;

  dismissIncomingAction(): void;

  processIncomingUrl(url: string): void;

  createRequestAddAccountDeviceUrl(options?: { accountAddress?: string, endpoint?: string, callbackEndpoint?: string }): string;

  createSecureAddDeviceUrl(): Promise<string>;

  createReduxMiddleware(): Middleware;
}
