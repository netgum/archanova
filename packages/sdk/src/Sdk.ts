import BN from 'bn.js';
import EthJs from 'ethjs';
import { TAbi } from 'ethjs-abi';
import { BehaviorSubject, from, of, Subscription, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { AccountDeviceStates, AccountDeviceTypes, AccountGamePlayers, AccountGameStates, AccountStates } from './constants';
import { IAccount, IAccountDevice, IAccountGame, IAccountGameHistory, IAccountTransaction, IApp, IPaginated } from './interfaces';
import {
  Account,
  AccountDevice,
  AccountGame,
  AccountTransaction,
  Action,
  Api,
  App,
  Contract,
  Device,
  Ens,
  Environment,
  Eth,
  Session,
  State,
  Storage,
  Url,
} from './modules';

/**
 * Sdk
 */
export class Sdk {
  public readonly api: Api;
  public readonly state: State;

  public error$ = new BehaviorSubject<any>(null);
  public event$ = new BehaviorSubject<Sdk.IEvent>(null);

  private readonly account: Account;
  private readonly accountDevice: AccountDevice;
  private readonly accountGame: AccountGame;
  private readonly accountTransaction: AccountTransaction;
  private readonly action: Action;
  private readonly app: App;
  private readonly contract: Contract;
  private readonly device: Device;
  private readonly ens: Ens;
  private readonly eth: Eth & EthJs;
  private readonly session: Session;
  private readonly storage: Storage;
  private readonly url: Url;

  /**
   * constructor
   * @param environment
   */
  constructor(environment: Environment) {
    if (!environment) {
      throw new Sdk.Error('unknown sdk environment');
    }

    this.storage = new Storage(
      environment.getConfig('storageOptions'),
      environment.getConfig('storageAdapter'),
    );

    this.state = new State(this.storage);

    this.api = new Api(
      environment.getConfig('apiOptions'),
      environment.getConfig('apiWebSocketConstructor'),
      this.state,
    );

    this.device = new Device(
      this.state,
      this.storage.createChild(Sdk.StorageNamespaces.Device),
    );

    this.session = new Session(this.api, this.device, this.state);
    this.eth = new Eth(
      environment.getConfig('ethOptions'),
      this.api,
      this.state,
    );
    this.ens = new Ens(
      environment.getConfig('ensOptions'),
      this.eth,
      this.state,
    );

    this.app = new App(this.api);
    this.account = new Account(this.api, this.state);
    this.contract = new Contract(this.eth);
    this.action = new Action(
      environment.getConfig('actionOptions'),
    );
    this.url = new Url(
      environment.getConfig('urlOptions'),
      environment.getConfig('urlAdapter'),
      this.action,
    );

    this.accountTransaction = new AccountTransaction(this.api, this.contract, this.device, this.state);
    this.accountDevice = new AccountDevice(this.accountTransaction, this.api, this.contract, this.state);
    this.accountGame = new AccountGame(this.api, this.contract, this.device, this.state);

    this.state.incomingAction$ = this.action.$incoming;

    this.catchError = this.catchError.bind(this);
  }

  /**
   * initializes sdk
   */
  public async initialize(): Promise<void> {
    this.require({
      initialized: false,
      accountConnected: false,
    });

    await this.device.setup();
    await this.state.setup();
    await this.session.setup();

    if (this.state.account) {
      await this.verifyAccount();
    }

    this.subscribeAccountBalance();
    this.subscribeApiEvents();
    this.subscribeAcceptedActions();

    this.state.initialized$.next(true);
  }

  /**
   * resets sdk
   * @param options
   */
  public async reset(options: { device?: boolean, session?: boolean } = {}): Promise<void> {
    this.require({
      accountConnected: null,
    });

    const { account$, accountDevice$ } = this.state;

    account$.next(null);
    accountDevice$.next(null);

    if (options.device) {
      await this.device.reset();
    }

    await this.session.reset({
      token: options.session,
    });
  }

// Account

  /**
   * gets connected accounts
   * @param page
   */
  public async getConnectedAccounts(page = 0): Promise<IPaginated<IAccount>> {
    this.require({
      accountConnected: null,
    });

    return this.account.getConnectedAccounts(page);
  }

  /**
   * searches account
   * @param address
   * @param ensName
   */
  public async searchAccount({ address, ensName }: { address?: string, ensName?: string }): Promise<IAccount> {
    this.require({
      accountConnected: null,
    });

    let result: IAccount = null;

    try {
      if (address) {
        result = await this
          .account
          .getAccount(address);
      } else if (ensName) {
        result = await this
          .account
          .searchAccount(ensName);
      }
    } catch (err) {
      result = null;
    }

    return result;
  }

  /**
   * creates account
   * @param ensLabel
   * @param ensRootName
   */
  public async createAccount(ensLabel?: string, ensRootName?: string): Promise<IAccount> {
    this.require({
      accountConnected: false,
    });

    await this.account.createAccount(
      this.ens.buildName(ensLabel, ensRootName),
    );

    return this.state.account;
  }

  /**
   * connects account
   * @param accountAddress
   */
  public async connectAccount(accountAddress: string): Promise<IAccount> {
    this.require({
      accountConnected: false,
    });

    await this.verifyAccount(accountAddress);

    return this.state.account;
  }

  /**
   * disconnects account
   */
  public async disconnectAccount(): Promise<void> {
    this.require({
      accountDeviceOwner: true,
    });

    const { deviceAddress } = this.state;
    await this.removeAccountDevice(deviceAddress);
    await this.reset();
  }

  /**
   * updates account
   * @param ensLabel
   * @param ensRootName
   */
  public async updateAccount(ensLabel: string, ensRootName?: string): Promise<IAccount> {
    this.require({
      accountCreated: true,
      accountDeviceOwner: true,
    });

    await this.account.updateAccount(
      this.ens.buildName(ensLabel, ensRootName),
    );

    return this.state.account;
  }

  /**
   * estimates account deployment
   * @param transactionSpeed
   */
  public async estimateAccountDeployment(transactionSpeed: Eth.TransactionSpeeds = null): Promise<Account.IEstimatedDeployment> {
    this.require({
      accountCreated: true,
      accountDeviceOwner: true,
    });

    return this.account.estimateAccountDeployment(
      this.eth.getGasPrice(transactionSpeed),
    );
  }

  /**
   * deploys account
   * @param transactionSpeed
   */
  public async deployAccount(transactionSpeed: Eth.TransactionSpeeds = null): Promise<string> {
    this.require({
      accountCreated: true,
      accountDeviceOwner: true,
    });

    return this.account.deployAccount(
      this.eth.getGasPrice(transactionSpeed),
    );
  }

// Account Device

  /**
   * gets connected account devices
   * @param page
   */
  public async getConnectedAccountDevices(page = 0): Promise<IPaginated<IAccountDevice>> {
    this.require();

    return this.accountDevice.getConnectedAccountDevices(page);
  }

  /**
   * gets connected account devices
   * @param deviceAddress
   */
  public async getConnectedAccountDevice(deviceAddress: string): Promise<IAccountDevice> {
    this.require();
    const { accountAddress } = this.state;

    return this.accountDevice.getAccountDevice(accountAddress, deviceAddress);
  }

  /**
   * gets account device
   * @param accountAddress
   * @param deviceAddress
   */
  public async getAccountDevice(accountAddress: string = null, deviceAddress: string): Promise<IAccountDevice> {
    this.require({
      accountConnected: null,
    });

    return this.accountDevice.getAccountDevice(accountAddress, deviceAddress);
  }

  /**
   * creates account device
   * @param deviceAddress
   */
  public async createAccountDevice(deviceAddress: string): Promise<IAccountDevice> {
    this.require({
      accountDeviceOwner: true,
    });

    return this.accountDevice.createAccountDevice(deviceAddress, AccountDeviceTypes.Owner);
  }

  /**
   * removes account device
   * @param deviceAddress
   */
  public async removeAccountDevice(deviceAddress: string): Promise<boolean> {
    this.require({
      accountDeviceOwner: true,
    });

    return this.accountDevice.removeAccountDevice(deviceAddress);
  }

  /**
   * estimates account device deployment
   * @param deviceAddress
   * @param transactionSpeed
   */
  public async estimateAccountDeviceDeployment(
    deviceAddress: string,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    return this.accountDevice.estimateAccountDeviceDeployment(
      deviceAddress,
      this.eth.getGasPrice(transactionSpeed),
    );
  }

  /**
   * estimates account device un-deployment
   * @param deviceAddress
   * @param transactionSpeed
   */
  public async estimateAccountDeviceUnDeployment(
    deviceAddress: string,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    return this.accountDevice.estimateAccountDeviceUnDeployment(
      deviceAddress,
      this.eth.getGasPrice(transactionSpeed),
    );
  }

// Account Transaction

  /**
   * gets connected account transactions
   * @param page
   */
  public async getConnectedAccountTransactions(page = 0): Promise<IPaginated<IAccountTransaction>> {
    this.require();

    return this.accountTransaction.getConnectedAccountTransactions(page);
  }

  /**
   * gets connected account transaction
   * @param hash
   */
  public async getConnectedAccountTransaction(hash: string): Promise<IAccountTransaction> {
    this.require();

    const { accountAddress } = this.state;
    return this.accountTransaction.getAccountTransaction(accountAddress, hash);
  }

  /**
   * gets account transaction
   * @param accountAddress
   * @param hash
   */
  public async getAccountTransaction(accountAddress: string, hash: string): Promise<IAccountTransaction> {
    this.require({
      accountConnected: null,
    });
    return this.accountTransaction.getAccountTransaction(accountAddress, hash);
  }

  /**
   * estimates account transaction
   * @param recipient
   * @param value
   * @param data
   * @param transactionSpeed
   */
  public async estimateAccountTransaction(
    recipient: string,
    value: number | string | BN,
    data: string | Buffer,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    return this.accountTransaction.estimateAccountTransaction(
      recipient,
      value,
      data,
      this.eth.getGasPrice(transactionSpeed),
    );
  }

  /**
   * submits account transaction
   * @param estimated
   */
  public async submitAccountTransaction(estimated: AccountTransaction.IEstimatedProxyTransaction): Promise<string> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    return this.accountTransaction.submitAccountProxyTransaction(estimated);
  }

// App

  /**
   * gets apps
   * @param page
   */
  public async getApps(page = 0): Promise<IPaginated<IApp>> {
    this.require({
      accountConnected: null,
    });

    return this.app.getApps(page);
  }

  /**
   * gets app
   * @param appAlias
   */
  public async getApp(appAlias: string): Promise<IApp> {
    this.require({
      accountConnected: null,
    });

    return this.app.getApp(appAlias);
  }

  /**
   * gets app open games
   * @param appAlias
   * @param page
   */
  public async getAppOpenGames(appAlias: string, page = 0): Promise<IPaginated<IAccountGame>> {
    this.require({
      accountConnected: null,
    });

    return this.app.getAppOpenGames(appAlias, page);
  }

// Action

  /**
   * accepts incoming action
   * @param action
   */
  public acceptIncomingAction(action: Action.IAction = null): this {
    this.require({
      accountConnected: null,
    });

    this.action.acceptAction(action);
    return this;
  }

  /**
   * dismisses incoming action
   */
  public dismissIncomingAction(): this {
    this.require({
      accountConnected: null,
    });

    this.action.dismissAction();
    return this;
  }

// Url

  /**
   * processes incoming url
   * @param url
   */
  public processIncomingUrl(url: string): void {
    this.require({
      accountConnected: null,
    });

    this.url.incoming$.next(url);
  }

  /**
   * creates request add account device url
   * @param options
   */
  public createRequestAddAccountDeviceUrl(options: { account?: string, endpoint?: string, callbackEndpoint?: string } = {}): string {
    this.require({
      accountConnected: false,
    });

    const { deviceAddress } = this.state;
    const action = Action.createAction<Action.IRequestAddAccountDevicePayload>(
      Action.Types.RequestAddAccountDevice,
      {
        device: deviceAddress,
        account: options.account || null,
        callbackEndpoint: options.callbackEndpoint || null,
      },
    );

    return this.url.buildActionUrl(action, options.endpoint || null);
  }

  /**
   * creates request sign secure code url
   */
  public async createRequestSignSecureCodeUrl(): Promise<string> {
    this.require({
      accountDeviceOwner: true,
    });

    const { deviceAddress } = this.state;

    const code = await this.session.createCode();
    const action = Action.createAction<Action.IRequestSignSecureCodePayload>(
      Action.Types.RequestSignSecureCode,
      {
        code,
        creator: deviceAddress,
      },
    );

    return this.url.buildActionUrl(action);
  }

// Utils

  /**
   * creates contract instance
   * @param abi
   * @param address
   */
  public createContractInstance<T = string>(abi: TAbi, address: string = null): Contract.ContractInstance<T> {
    this.require({
      accountConnected: null,
    });

    return Contract.createContractInstance(abi, address, this.eth);
  }

  /**
   * signs personal message
   * @param message
   */
  public signPersonalMessage(message: string | Buffer): Buffer {
    this.require({
      accountConnected: null,
    });

    return this.device.signPersonalMessage(message);
  }

// Private

  private async verifyAccount(accountAddress: string = null): Promise<void> {
    if (!accountAddress) {
      ({ accountAddress } = this.state);
    }

    const {
      account$,
      accountDevice$,
      deviceAddress,
    } = this.state;

    let account: IAccount = null;
    let accountDevice: IAccountDevice = null;

    if (accountAddress) {
      account = await this.account.getAccount(accountAddress).catch(() => null);
      if (account) {
        accountDevice = await this.accountDevice.getAccountDevice(accountAddress, deviceAddress).catch(() => null);
      }
    }
    account$.next(account && accountDevice ? account : null);
    accountDevice$.next(accountDevice);
  }

  private subscribeAccountBalance(): void {
    const { account$ } = this.state;

    let subscription: Subscription = null;

    account$
      .subscribe((account) => {
        if (account) {
          if (!subscription) {
            subscription = timer(0, 5000)
              .pipe(
                switchMap(() => from(
                  this
                    .eth
                    .getBalance(account.address, 'pending')
                    .catch(() => null)),
                ),
                filter(balance => !!balance),
                map((real) => {
                  const { account } = this.state;

                  return {
                    ...account,
                    balance: {
                      real,
                      virtual: account.balance.virtual,
                    },
                  };
                }),
              )
              .subscribe(account$);
          }
        } else if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
      });
  }

  private subscribeApiEvents(): void {
    this
      .api
      .event$
      .pipe(
        filter(event => !!event),
        switchMap(({ name, payload }) => from(this.wrapAsync(async () => {
          const { account$, accountDevice$, deviceAddress, accountAddress } = this.state;

          switch (name) {
            case Api.EventNames.AccountUpdated: {
              const { account } = payload;
              if (accountAddress === account) {
                const account = await this.account.getAccount(accountAddress);
                if (account) {
                  account$.next(account);
                }
              } else {
                const account = await this.account.getAccount(accountAddress);
                this.emitEvent(Sdk.EventNames.AccountUpdated, account);
              }
              break;
            }
            case Api.EventNames.AccountDeviceUpdated: {
              const { account, device } = payload;
              if (deviceAddress === device) {
                switch (accountAddress) {
                  case account:
                    const accountDevice = await this.accountDevice.getAccountDevice(account, device);
                    if (accountDevice) {
                      accountDevice$.next(accountDevice);
                    }
                    break;

                  case null:
                    await this.verifyAccount(account);
                    break;

                  default:
                }
              } else if (account === accountAddress) {
                const accountDevice = await this.accountDevice.getAccountDevice(account, device);
                this.emitEvent(Sdk.EventNames.AccountDeviceUpdated, accountDevice);
              }
              break;
            }
            case Api.EventNames.AccountDeviceRemoved: {
              const { account, device } = payload;
              if (accountAddress === account) {
                if (deviceAddress === device) {
                  await this.reset();
                } else {
                  this.emitEvent(Sdk.EventNames.AccountDeviceRemoved, device);
                }
              }
              break;
            }
            case Api.EventNames.AccountTransactionUpdated: {
              const { account, hash } = payload;
              if (accountAddress === account) {
                const accountTransaction = await this.accountTransaction.getAccountTransaction(account, hash);
                this.emitEvent(Sdk.EventNames.AccountTransactionUpdated, accountTransaction);
              }
              break;
            }
            case Api.EventNames.AccountGameUpdated: {
              const { account, game } = payload;
              break;
            }
            case Api.EventNames.AccountPaymentUpdated: {
              const { account, hash } = payload;
              break;
            }
            case Api.EventNames.SecureCodeSigned: {
              const { device, code } = payload;
              if (
                deviceAddress &&
                accountAddress &&
                this.session.verifyCode(code)
              ) {
                const action = Action
                  .createAction<Action.IRequestAddAccountDevicePayload>(
                    Action.Types.RequestAddAccountDevice, {
                      device,
                      account: accountAddress,
                    },
                  );

                this.action.$incoming.next(action);
              }
              break;
            }
          }
        }))),
      )
      .subscribe();
  }

  private subscribeAcceptedActions(): void {
    const { account$ } = this.state;
    const { $accepted } = this.action;

    let hasAccount = null;
    let subscription: Subscription = null;

    account$
      .subscribe((account) => {
        if (hasAccount === !!account) {
          return;
        }

        hasAccount = !!account;

        if (subscription) {
          subscription.unsubscribe();
        }

        subscription = $accepted
          .pipe(
            filter(action => !!action),
            switchMap(({ type, payload }) => from(this.wrapAsync(async () => {
              const { accountAddress } = this.state;

              switch (type) {
                case Action.Types.RequestAddAccountDevice: {
                  const { device, account, callbackEndpoint } = payload as Action.IRequestAddAccountDevicePayload;
                  if (
                    accountAddress &&
                    device &&
                    (!account || accountAddress === account)
                  ) {
                    await this.createAccountDevice(device);
                    if (callbackEndpoint) {
                      const action = Action
                        .createAction<Action.IAccountDeviceAddedPayload>(
                          Action.Types.AccountDeviceAdded, {
                            account: accountAddress,
                          },
                        );

                      this.url.openActionUrl(action, callbackEndpoint);
                    }
                  }
                  break;
                }

                case Action.Types.AccountDeviceAdded: {
                  if (!accountAddress) {
                    const { account } = payload as Action.IAccountDeviceAddedPayload;
                    await this.verifyAccount(account);
                  }
                  break;
                }

                case Action.Types.RequestSignSecureCode: {
                  if (!accountAddress) {
                    const { code, creator } = payload as Action.IRequestSignSecureCodePayload;
                    await this.session.signCode(creator, code);
                  }
                  break;
                }
              }
            }))),
            map(() => null),
          )
          .subscribe($accepted);
      });
  }

  private wrapAsync(wrapped: () => Promise<void>): Promise<void> {
    return wrapped()
      .catch((err) => {
        this.catchError(err);
        return null;
      });
  }

  private catchError(err): void {
    this.error$.next(err);
  }

  private emitEvent<T = any>(name: Sdk.EventNames, payload: T): void {
    this.event$.next({
      name,
      payload,
    });
  }

  private require(options: Sdk.IRequireOptions = {}): void {
    const {
      account,
      accountDevice,
      initialized,
    } = this.state;

    options = {
      initialized: true,
      accountConnected: true,
      ...options,
    };

    const accountState = account && !account.nextState
      ? account.state
      : null;

    const accountDeviceState = accountDevice && !accountDevice.nextState
      ? accountDevice.state
      : null;
    const accountDeviceType = accountDevice
      ? accountDevice.type
      : null;

    if (options.initialized && !initialized) {
      throw new Sdk.Error('sdk not initialized');
    }
    if (!options.initialized && initialized) {
      throw new Sdk.Error('sdk already initialized');
    }
    if (options.accountConnected === true && !account) {
      throw new Sdk.Error('account disconnected');
    }
    if (options.accountConnected === false && account) {
      throw new Sdk.Error('account already connected');
    }
    if (options.accountCreated && accountState !== AccountStates.Created) {
      throw new Sdk.Error('account should be in Created state');
    }
    if (options.accountDeployed && accountState !== AccountStates.Deployed) {
      throw new Sdk.Error('account should be in Deployed state');
    }
    if (options.accountDeviceCreated && accountDeviceState !== AccountDeviceStates.Created) {
      throw new Sdk.Error('account device should be in Created state');
    }
    if (options.accountDeviceDeployed && accountDeviceState !== AccountDeviceStates.Deployed) {
      throw new Sdk.Error('account device should be in Deployed state');
    }
    if (options.accountDeviceOwner && accountDeviceType !== AccountDeviceTypes.Owner) {
      throw new Sdk.Error('account device is not an Owner');
    }
  }
}

export namespace Sdk {
  export enum StorageNamespaces {
    Device = 'device',
  }

  export class Error extends global.Error {
    //
  }

  export interface IRequireOptions {
    accountConnected?: boolean;
    accountCreated?: boolean;
    accountDeployed?: boolean;
    accountDeviceCreated?: boolean;
    accountDeviceDeployed?: boolean;
    accountDeviceOwner?: boolean;
    initialized?: boolean;
  }

  export enum EventNames {
    AccountUpdated = 'AccountUpdated',
    AccountDeviceUpdated = 'AccountDeviceUpdated',
    AccountDeviceRemoved = 'AccountDeviceRemoved',
    AccountTransactionUpdated = 'AccountTransactionUpdated',
    AccountGameUpdated = 'AccountGameUpdated',
  }

  export interface IEvent<T = any> {
    name: EventNames;
    payload: T;
  }
}
