import { anyToBN, anyToBuffer, ZERO_ADDRESS } from '@netgum/utils';
import BN from 'bn.js';
import EthJs from 'ethjs';
import { TAbi } from 'ethjs-abi';
import { BehaviorSubject, from, Subscription, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AccountDeviceStates, AccountDeviceTypes, AccountGamePlayers, AccountGameStates, AccountStates } from './constants';
import {
  IAccount,
  IAccountDevice,
  IAccountFriendRecovery,
  IAccountGame,
  IAccountPayment,
  IAccountTransaction,
  IAccountVirtualBalance,
  IApp,
  IPaginated,
  IToken,
} from './interfaces';
import {
  Account,
  AccountDevice,
  AccountFriendRecovery,
  AccountGame,
  AccountPayment,
  AccountTransaction,
  AccountVirtualBalance,
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
  Token,
  Url,
} from './modules';

/**
 * Sdk
 */
export class Sdk {
  public readonly api: Api;
  public readonly state: State;

  public readonly error$ = new BehaviorSubject<any>(null);
  public readonly event$ = new BehaviorSubject<Sdk.IEvent>(null);

  protected readonly account: Account;
  protected readonly accountDevice: AccountDevice;
  protected readonly accountFriendRecovery: AccountFriendRecovery;
  protected readonly accountGame: AccountGame;
  protected readonly accountPayment: AccountPayment;
  protected readonly accountTransaction: AccountTransaction;
  protected readonly accountVirtualBalance: AccountVirtualBalance;
  protected readonly action: Action;
  protected readonly app: App;
  protected readonly contract: Contract;
  protected readonly device: Device;
  protected readonly ens: Ens;
  protected readonly eth: Eth & EthJs;
  protected readonly session: Session;
  protected readonly storage: Storage;
  protected readonly token: Token;
  protected readonly url: Url;

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
    this.account = new Account(this.api, this.eth, this.state);
    this.contract = new Contract(this.eth);
    this.action = new Action(
      environment.getConfig('actionOptions'),
    );
    this.url = new Url(
      environment.getConfig('urlOptions'),
      environment.getConfig('urlAdapter'),
      this.action,
      this.eth,
    );

    this.accountTransaction = new AccountTransaction(this.api, this.contract, this.device, this.state);
    this.accountPayment = new AccountPayment(this.api, this.contract, this.device, this.state);
    this.accountDevice = new AccountDevice(this.accountTransaction, this.api, this.state);
    this.accountGame = new AccountGame(this.api, this.contract, this.device, this.state);
    this.accountFriendRecovery = new AccountFriendRecovery(this.accountDevice, this.api, this.contract, this.device, this.state);
    this.accountVirtualBalance = new AccountVirtualBalance(this.api, this.state);
    this.token = new Token(this.api);

    this.state.incomingAction$ = this.action.$incoming;

    this.catchError = this.catchError.bind(this);
  }

  /**
   * initializes sdk
   * @param options
   */
  public async initialize(options: { device?: Device.ISetupOptions } = {}): Promise<void> {
    this.require({
      initialized: false,
      accountConnected: false,
    });

    await this.device.setup(options.device || {});
    await this.state.setup();
    await this.session.setup();

    if (this.state.account) {
      await this.verifyAccount();
    }

    this.state.initialized$.next(true);

    this.subscribeAccountBalance();
    this.subscribeApiEvents();
    this.subscribeAcceptedActions();
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
      token: options.device || options.session,
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
      initialized: null,
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

    await this.verifyAccount();

    return this.state.account;
  }

  /**
   * connects account
   * @param accountAddress
   */
  public async connectAccount(accountAddress: string): Promise<IAccount> {
    await this.disconnectAccount();
    await this.verifyAccount(accountAddress);

    return this.state.account;
  }

  /**
   * disconnects account
   */
  public async disconnectAccount(): Promise<void> {
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

    return this
      .account
      .deployAccount(
        this.eth.getGasPrice(transactionSpeed),
      )
      .catch(() => null);
  }

// Account Virtual Balance

  /**
   * estimates top-up account virtual balance
   * @param value
   * @param tokenAddress
   * @param transactionSpeed
   */
  public async estimateTopUpAccountVirtualBalance(
    value: number | string | BN,
    tokenAddress: string = null,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    const { account, virtualPaymentManager, erc20Token } = this.contract;

    let result: AccountTransaction.IEstimatedProxyTransaction;

    if (tokenAddress) {
      const proxyData: string[] = [];

      {
        const data = erc20Token
          .encodeMethodInput('approve', virtualPaymentManager.address, anyToBN(value, { defaults: new BN(0) }));

        proxyData.push(
          account.encodeMethodInput(
            'executeTransaction',
            tokenAddress,
            new BN(0),
            data,
          ),
        );
      }

      {
        const data = virtualPaymentManager
          .encodeMethodInput('depositToken', tokenAddress, anyToBN(value, { defaults: new BN(0) }));

        proxyData.push(
          account.encodeMethodInput(
            'executeTransaction',
            virtualPaymentManager.address,
            new BN(0),
            data,
          ),
        );
      }

      result = await this.accountTransaction.estimateAccountProxyTransaction(
        proxyData,
        this.eth.getGasPrice(transactionSpeed),
      );
    } else {
      result = await this.estimateAccountTransaction(
        virtualPaymentManager.address,
        value,
        Buffer.alloc(0),
        transactionSpeed,
      );
    }

    return result;
  }

  /**
   * estimates withdraw from account virtual balance
   * @param value
   * @param tokenAddress
   * @param transactionSpeed
   */
  public async estimateWithdrawFromAccountVirtualBalance(
    value: number | string | BN,
    tokenAddress: string = null,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    const { accountAddress } = this.state;
    const payment = await this.createAccountPayment(accountAddress, tokenAddress, value);
    const { hash } = await this.accountPayment.signAccountPayment(payment);

    return this.estimateWithdrawAccountPayment(
      hash,
      transactionSpeed,
    );
  }

  /**
   * gets connected account virtual balances
   * @param page
   */
  public async getConnectedAccountVirtualBalances(page = 0): Promise<IPaginated<IAccountVirtualBalance>> {
    this.require();

    return this.accountVirtualBalance.getConnectedAccountVirtualBalances(page);
  }

  /**
   * gets connected account virtual balance
   * @param symbolOrAddress
   */
  public async getConnectedAccountVirtualBalance(symbolOrAddress: string): Promise<IAccountVirtualBalance> {
    this.require();

    return this.accountVirtualBalance.getConnectedAccountVirtualBalance(symbolOrAddress);
  }

// Account Friend Recovery

  /**
   * estimates add account friend recovery extension
   * @param transactionSpeed
   */
  public async estimateAddAccountFriendRecoveryExtension(
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });
    const { account } = this.contract;
    const { accountFriendRecovery } = this.contract;

    await this.accountDevice.createAccountDevice(
      accountFriendRecovery.address,
      AccountDeviceTypes.Extension,
    ).catch(() => null);

    const data = account.encodeMethodInput(
      'addDevice',
      accountFriendRecovery.address,
      true,
    );

    return this.accountTransaction.estimateAccountProxyTransaction(
      data,
      this.eth.getGasPrice(transactionSpeed),
    );
  }

  /**
   * estimates setup account friend recovery extension
   * @param requiredFriends
   * @param friendAddresses
   * @param transactionSpeed
   */
  public async estimateSetupAccountFriendRecoveryExtension(
    requiredFriends: number,
    friendAddresses: string[],
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<any> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    const { accountFriendRecovery } = this.contract;
    const data = accountFriendRecovery.encodeMethodInput(
      'setup',
      requiredFriends,
      friendAddresses,
    );

    return this.estimateAccountTransaction(
      accountFriendRecovery.address,
      0,
      data,
      transactionSpeed,
    );
  }

  /**
   * gets connect account friend recovery
   */
  public getConnectAccountFriendRecovery(): Promise<IAccountFriendRecovery> {
    this.require();

    const { accountAddress } = this.state;
    return this.accountFriendRecovery.getAccountFriendRecovery(accountAddress);
  }

  /**
   * gets account friend recovery
   * @param accountAddress
   */
  public getAccountFriendRecovery(accountAddress: string): Promise<IAccountFriendRecovery> {
    this.require({
      accountConnected: null,
    });

    return this.accountFriendRecovery.getAccountFriendRecovery(accountAddress);
  }

  /**
   * starts account friend recovery
   * @param accountAddress
   * @param transactionSpeed
   */
  public async startAccountFriendRecovery(
    accountAddress: string,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<IAccountFriendRecovery> {
    this.require({
      accountConnected: null,
    });

    await this.accountFriendRecovery.startAccountFriendRecovery(
      accountAddress,
      this.eth.getGasPrice(transactionSpeed),
    );

    return this.state.accountFriendRecovery;
  }

  /**
   * collects account friend signature
   * @param friendAddress
   * @param friendSignature
   */
  public async collectAccountFriendSignature(
    friendAddress: string,
    friendSignature: string,
  ): Promise<IAccountFriendRecovery> {
    this.require({
      accountConnected: null,
    });

    await this.accountFriendRecovery.collectAccountFriendSignature(
      friendAddress,
      friendSignature,
    );

    return this.state.accountFriendRecovery;
  }

  /**
   * signs account friend recovery
   * @param accountAddress
   * @param deviceAddress
   * @param transactionSpeed
   */
  public signAccountFriendRecovery(
    accountAddress: string,
    deviceAddress: string,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<string> {
    this.require({
      accountConnected: null,
    });

    return this.accountFriendRecovery.signAccountFriendRecovery(
      accountAddress,
      deviceAddress,
      this.eth.getGasPrice(transactionSpeed),
    );
  }

  /**
   * cancels account friend recovery
   */
  public async cancelAccountFriendRecovery(): Promise<void> {
    this.require({
      accountConnected: null,
    });

    await this.accountFriendRecovery.cancelAccountFriendRecovery();
  }

  /**
   * submits account friend recovery
   */
  public async submitAccountFriendRecovery(): Promise<string> {
    this.require({
      accountConnected: null,
    });

    return this.accountFriendRecovery
      .submitAccountFriendRecovery()
      .catch(() => null);
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
    const { account } = this.contract;

    const data = account.encodeMethodInput(
      'addDevice',
      deviceAddress,
      true,
    );

    return this.accountTransaction.estimateAccountProxyTransaction(
      data,
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
    const { account } = this.contract;

    const data = account.encodeMethodInput(
      'removeDevice',
      deviceAddress,
    );

    return this.accountTransaction.estimateAccountProxyTransaction(
      data,
      this.eth.getGasPrice(transactionSpeed),
    );
  }

// Account Transaction

  /**
   * gets connected account transactions
   * @param hash
   * @param page
   */
  public async getConnectedAccountTransactions(hash = '', page = 0): Promise<IPaginated<IAccountTransaction>> {
    this.require();

    return this.accountTransaction.getConnectedAccountTransactions(page, hash);
  }

  /**
   * gets connected account transaction
   * @param hash
   * @param index
   */
  public async getConnectedAccountTransaction(hash: string, index = 0): Promise<IAccountTransaction> {
    this.require({
      accountConnected: true,
    });

    const { accountAddress } = this.state;
    return this.accountTransaction.getAccountTransaction(accountAddress, hash, index);
  }

  /**
   * gets account transaction
   * @param accountAddress
   * @param hash
   * @param index
   */
  public async getAccountTransaction(accountAddress: string, hash: string, index = 0): Promise<IAccountTransaction> {
    this.require({
      accountConnected: null,
    });
    return this.accountTransaction.getAccountTransaction(accountAddress, hash, index);
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

    const { account } = this.contract;
    const proxyData = account.encodeMethodInput(
      'executeTransaction',
      recipient,
      anyToBN(value, { defaults: new BN(0) }),
      anyToBuffer(data, { defaults: Buffer.alloc(0) }),
    );

    return this.accountTransaction.estimateAccountProxyTransaction(
      proxyData,
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

    return this
      .accountTransaction
      .submitAccountProxyTransaction(estimated)
      .catch(() => null);
  }

// Account Payment

  /**
   * gets connected account payments
   * @param page
   */
  public async getConnectedAccountPayments(page = 0): Promise<IPaginated<IAccountPayment>> {
    this.require();

    return this.accountPayment.getConnectedAccountPayments(page);
  }

  /**
   * get connected account payment
   * @param hash
   */
  public async getConnectedAccountPayment(hash: string): Promise<IAccountPayment> {
    this.require();

    return this.accountPayment.getConnectedAccountPayment(hash);
  }

  /**
   * creates account payment
   * @param recipient
   * @param tokenAddress
   * @param value
   */
  public async createAccountPayment(
    recipient: string,
    tokenAddress: string,
    value: number | string | BN,
  ): Promise<IAccountPayment> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: !!recipient,
    });

    return this.accountPayment.createAccountPayment(
      recipient,
      tokenAddress,
      value,
    );
  }

  /**
   * signs account payment
   * @param hash
   */
  public async signAccountPayment(hash: string): Promise<IAccountPayment> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    const payment = await this.accountPayment.getConnectedAccountPayment(hash);

    return this.accountPayment.signAccountPayment(payment);
  }

  /**
   * grab account payment
   * @param hash
   * @param recipient
   */
  public async grabAccountPayment(hash: string, recipient: string = null): Promise<IAccountPayment> {
    this.require();

    return this.accountPayment.grabAccountPayment(hash, recipient);
  }

  /**
   * cancel account payment
   * @param hash
   */
  public async cancelAccountPayment(hash: string): Promise<boolean> {
    this.require({
      accountDeviceOwner: true,
    });

    return this.accountPayment.cancelAccountPayment(hash);
  }

  /**
   * estimates deposit account payment
   * @param hash
   * @param transactionSpeed
   */
  public async estimateDepositAccountPayment(
    hash: string,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });
    const { sender, recipient, guardian, token, value } = await this.accountPayment.getConnectedAccountPayment(hash);
    const { virtualPaymentManager } = this.contract;
    const data = virtualPaymentManager.encodeMethodInput(
      'depositPayment',
      sender.account.address,
      recipient.address || recipient.account.address,
      token && token.address ? token.address : ZERO_ADDRESS,
      hash,
      value,
      sender.signature,
      guardian.signature,
    );

    return this.estimateAccountTransaction(
      virtualPaymentManager.address,
      null,
      data,
      transactionSpeed,
    );
  }

  /**
   * estimate withdraw account payment
   * @param hash
   * @param transactionSpeed
   */
  public async estimateWithdrawAccountPayment(
    hash: string,
    transactionSpeed: Eth.TransactionSpeeds = null,
  ): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    const { sender, recipient, guardian, value, token } = await this.accountPayment.getConnectedAccountPayment(hash);
    const { virtualPaymentManager } = this.contract;
    const data = virtualPaymentManager.encodeMethodInput(
      'withdrawPayment',
      sender.account.address,
      recipient.address || recipient.account.address,
      token && token.address ? token.address : ZERO_ADDRESS,
      hash,
      value,
      sender.signature,
      guardian.signature,
    );

    return this.estimateAccountTransaction(
      virtualPaymentManager.address,
      null,
      data,
      transactionSpeed,
    );
  }

// Account Game

  /**
   * gets connected account games
   * @param appAlias
   * @param page
   */
  public async getConnectedAccountGames(appAlias: string, page = 0): Promise<IPaginated<IAccountGame>> {
    this.require();

    return this.accountGame.getConnectedAccountGames(appAlias, page);
  }

  /**
   * gets account game
   * @param gameId
   */
  public async getAccountGame(gameId: number): Promise<IAccountGame> {
    this.require();

    return this.accountGame.getAccountGame(gameId);
  }

  /**
   * create account game
   * @param appAlias
   * @param deposit
   * @param data
   */
  public async createAccountGame(
    appAlias: string,
    deposit: {
      value: number | string | BN;
      token?: string;
    },
    data: string,
  ): Promise<IAccountGame> {
    this.require({
      accountDeviceOwner: true,
    });

    return this.accountGame.createAccountGame(appAlias, deposit, data);
  }

  /**
   * joins account game
   * @param gameId
   */
  public async joinAccountGame(gameId: number): Promise<IAccountGame> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    const { accountAddress } = this.state;
    const game = await this.accountGame.getAccountGame(gameId);

    if (game.creator.account.address === accountAddress) {
      throw new Sdk.Error('invalid game creator');
    }

    if (game.state !== AccountGameStates.Open) {
      throw new Sdk.Error('invalid game state');
    }

    return this.accountGame.joinAccountGame(game);
  }

  /**
   * cancel account game
   * @param gameId
   */
  public cancelAccountGame(gameId: number): Promise<boolean> {
    this.require({
      accountDeviceOwner: true,
    });

    return this.accountGame.cancelAccountGame(gameId);
  }

  /**
   * starts account game
   * @param gameId
   */
  public async startAccountGame(gameId: number): Promise<IAccountGame> {
    this.require({
      accountDeviceOwner: true,
      accountDeviceDeployed: true,
    });

    const { accountAddress } = this.state;
    const game = await this.accountGame.getAccountGame(gameId);

    if (game.creator.account.address !== accountAddress) {
      throw new Sdk.Error('invalid game creator');
    }

    if (game.state !== AccountGameStates.Opened) {
      throw new Sdk.Error('invalid game state');
    }

    return this.accountGame.startAccountGame(game);
  }

  /**
   * updates account game
   * @param gameId
   * @param data
   */
  public async updateAccountGame(gameId: number, data: string): Promise<IAccountGame> {
    this.require();

    const { accountAddress } = this.state;
    const game = await this.accountGame.getAccountGame(gameId);

    if (
      game.state !== AccountGameStates.Started ||
      (game.whoseTurn === AccountGamePlayers.Creator && game.creator.account.address !== accountAddress) ||
      (game.whoseTurn === AccountGamePlayers.Opponent && game.opponent.account.address !== accountAddress)
    ) {
      throw new Sdk.Error('invalid game state');
    }

    return this.accountGame.updateAccountGame(game, data);
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

// Token

  /**
   * gets tokens
   * @param page
   */
  public async getTokens(page = 0): Promise<IPaginated<IToken>> {
    this.require({
      accountConnected: null,
    });

    return this.token.getTokens(page);
  }

  /**
   * gets token
   * @param symbolOrAddress
   */
  public async getToken(symbolOrAddress: string): Promise<IToken> {
    this.require({
      accountConnected: null,
    });

    return this.token.getToken(symbolOrAddress);
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
  public dismissIncomingAction(): void {
    this.require({
      accountConnected: null,
    });

    this.action.dismissAction();
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
   * signs personal message
   * @param message
   */
  public signPersonalMessage(message: string | Buffer): Buffer {
    this.require({
      accountConnected: null,
    });

    return this.device.signPersonalMessage(message);
  }

  /**
   * creates contract instance
   * @param abi
   * @param address
   */
  public createContractInstance(abi: TAbi, address: string = null): Contract.ContractInstance {
    return this.contract.createInstance(abi, address);
  }

// Protected

  protected async verifyAccount(accountAddress: string = null): Promise<void> {
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

  protected subscribeAccountBalance(): void {
    const { account$ } = this.state;

    let subscription: Subscription = null;

    account$
      .subscribe((account) => {
        if (account) {
          if (!subscription) {
            subscription = timer(5000, 5000)
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
                filter(account => !!account),
              )
              .subscribe(account$);
          }
        } else if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
      });
  }

  protected subscribeApiEvents(): void {
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

            case Api.EventNames.AccountFriendRecoveryUpdated: {
              const { account } = payload;
              if (accountAddress === account) {
                const accountFriendRecovery = await this.accountFriendRecovery.getAccountFriendRecovery(accountAddress);
                this.emitEvent(Sdk.EventNames.AccountFriendRecoveryUpdated, accountFriendRecovery);
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
            case Api.EventNames.AccountVirtualBalanceUpdated: {
              const { account, token } = payload;
              if (accountAddress === account) {
                const accountVirtualBalance = await this.accountVirtualBalance.getConnectedAccountVirtualBalance(token);
                this.emitEvent(Sdk.EventNames.AccountVirtualBalanceUpdated, accountVirtualBalance);
              }
              break;
            }
            case Api.EventNames.AccountTransactionUpdated: {
              const { account, hash, index } = payload;
              if (accountAddress === account) {
                const accountTransaction = await this.accountTransaction.getAccountTransaction(account, hash, index);
                this.emitEvent(Sdk.EventNames.AccountTransactionUpdated, accountTransaction);
              }
              break;
            }
            case Api.EventNames.AccountGameUpdated: {
              const { account, game } = payload;
              if (accountAddress === account) {
                const accountGame = await this.accountGame.getAccountGame(game);
                this.emitEvent(Sdk.EventNames.AccountGameUpdated, accountGame);
              }
              break;
            }
            case Api.EventNames.AccountPaymentUpdated: {
              const { account, hash } = payload;
              if (accountAddress === account) {
                const accountPayment = await this.accountPayment.getConnectedAccountPayment(hash);
                this.emitEvent(Sdk.EventNames.AccountPaymentUpdated, accountPayment);
              }
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

  protected subscribeAcceptedActions(): void {
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

  protected wrapAsync(wrapped: () => Promise<void>): Promise<void> {
    return wrapped()
      .catch((err) => {
        this.catchError(err);
        return null;
      });
  }

  protected catchError(err): void {
    this.error$.next(err);
  }

  protected emitEvent<T = any>(name: Sdk.EventNames, payload: T): void {
    this.event$.next({
      name,
      payload,
    });
  }

  protected require(options: Sdk.IRequireOptions = {}): void {
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

    if (options.initialized === true && !initialized) {
      throw new Sdk.Error('sdk not initialized');
    }
    if (options.initialized === false && initialized) {
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
    AccountFriendRecoveryUpdated = 'AccountFriendRecoveryUpdated',
    AccountTransactionUpdated = 'AccountTransactionUpdated',
    AccountVirtualBalanceUpdated = 'AccountVirtualBalanceUpdated',
    AccountPaymentUpdated = 'AccountPaymentUpdated',
    AccountGameUpdated = 'AccountGameUpdated',
  }

  export interface IEvent<T = any> {
    name: EventNames;
    payload: T;
  }
}
