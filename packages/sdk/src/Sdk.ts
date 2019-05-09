import { from, of, timer } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { IAccount, IAccountDevice, IPaginated } from './interfaces';
import { Account, AccountDevice, Api, Contract, Device, Ens, Environment, Eth, Event, Session, State, Storage } from './modules';

/**
 * Sdk
 */
export class Sdk {
  public readonly api: Api;
  public readonly state: State;

  private readonly account: Account;
  private readonly accountDevice: AccountDevice;
  private readonly contract: Contract;
  private readonly device: Device;
  private readonly ens: Ens;
  private readonly eth: Eth;
  private readonly event: Event;
  private readonly session: Session;
  private readonly storage: Storage;

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

    this.account = new Account(this.api, this.state);
    this.accountDevice = new AccountDevice(this.api, this.state);
    this.contract = new Contract(this.eth);
    this.event = new Event(this.api);

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
    this.subscribeEvents();

    this.state.initialized$.next(true);
  }

  /**
   * resets sdk
   */
  public async reset(): Promise<void> {
    //
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
  public async createAccount({ ensLabel, ensRootName }: { ensLabel?: string, ensRootName?: string } = {}): Promise<IAccount> {
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
   * @param address
   */
  public async connectAccount(address: string): Promise<IAccount> {
    this.require({
      accountConnected: false,
    });

    await this.verifyAccount();

    return this.state.account;
  }

  /**
   * updates account
   * @param ensLabel
   * @param ensRootName
   */
  public async updateAccount({ ensLabel, ensRootName }: { ensLabel: string, ensRootName?: string }): Promise<IAccount> {
    this.require();

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
    this.require();

    return this.account.estimateAccountDeployment(
      this.eth.getGasPrice(transactionSpeed),
    );
  }

  /**
   * deploys account
   * @param transactionSpeed
   */
  public async deployAccount(transactionSpeed: Eth.TransactionSpeeds = null): Promise<string> {
    this.require();

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

// Utils

  /**
   * signs personal message
   * @param message
   */
  public signPersonalMessage(message: string | Buffer): Buffer {
    return this.device.signPersonalMessage(message);
  }

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
    if (account && accountDevice) {
      account$.next(account);
      accountDevice$.next(accountDevice);
    } else {
      account$.next(null);
      accountDevice$.next(null);
    }
  }

  private subscribeAccountBalance(): void {
    const { account$, accountBalance$ } = this.state;

    account$
      .pipe(
        switchMap(account => account
          ? timer(0, 5000)
            .pipe(
              switchMap(() => from(
                this
                  .eth
                  .getBalance(account.address, 'pending')
                  .catch(() => null)),
              ),
              filter(balance => !!balance),
              takeUntil(account$.pipe(filter(account => !account))),
            )
          : of([null]),
        ),
      )
      .subscribe(accountBalance$);
  }

  private subscribeEvents(): void {
    this
      .event
      .ofName(Event.Names.AccountUpdated)
      .pipe(switchMap(({ account }) => from(this.wrapAsync(async () => {
        const { account$, accountAddress } = this.state;
        if (accountAddress === account) {
          const account = await this.account.getAccount(accountAddress);
          account$.next(account);

        }
      }))))
      .subscribe();

    this
      .event
      .ofName(Event.Names.AccountDeviceUpdated)
      .pipe(switchMap(({ account, device }) => from(this.wrapAsync(async () => {
        const { accountDevice$, deviceAddress, accountAddress } = this.state;
        if (deviceAddress === device) {
          switch (accountAddress) {
            case account:
              const accountDevice = await this.accountDevice.getAccountDevice(account, device);
              accountDevice$.next(accountDevice);
              break;

            case null:
              await this.verifyAccount(account);
              break;
          }
        }
      }))))
      .subscribe();

    this
      .event
      .ofName(Event.Names.AccountDeviceRemoved)
      .pipe(switchMap(({ account, device }) => from(this.wrapAsync(async () => {
        const { account$, accountDevice$ } = this.state;
        if (
          this.state.accountAddress === account &&
          this.state.deviceAddress === device
        ) {
          account$.next(null);
          accountDevice$.next(null);
        }
      }))))
      .subscribe();

    this
      .event
      .ofName(Event.Names.AccountTransactionUpdated)
      .pipe(switchMap(({ account, hash }) => from(this.wrapAsync(async () => {
        if (this.state.accountAddress === account) {
          //
        }
      }))))
      .subscribe();

    this
      .event
      .ofName(Event.Names.AccountGameUpdated)
      .pipe(switchMap(({ account, game }) => from(this.wrapAsync(async () => {
        if (this.state.accountAddress === account) {
          //
        }
      }))))
      .subscribe();

    this
      .event
      .ofName(Event.Names.SecureCodeSigned)
      .pipe(switchMap(({ device, code }) => from(this.wrapAsync(async () => {
        if (this.state.deviceAddress === device) {
          //
        }
      }))))
      .subscribe();
  }

  private wrapAsync(wrapped: () => Promise<void>): Promise<void> {
    return wrapped()
      .catch((err) => {
        this.catchError(err);
        return null;
      });
  }

  private catchError(err): void {
    this.state.error$.next(err);
  }

  private require(options: Sdk.IRequireOptions = {}): void {
    const {
      account,
      initialized,
    } = this.state;

    options = {
      initialized: true,
      accountConnected: true,
      ...options,
    };

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
    accountDeviceOwner?: boolean;
    accountDeviceCreated?: boolean;
    accountDeviceDeployed?: boolean;
    initialized?: boolean;
  }
}
