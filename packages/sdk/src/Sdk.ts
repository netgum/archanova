import { IBN } from 'bn.js';
import { Middleware, Store } from 'redux';
import { from, merge, of, Subscription, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ISdk } from './interfaces';
import { ReduxActionTypes } from './redux';
import {
  actionPayload,
  ActionTypes,
  eventPayload,
  EventTypes,
  IAccount,
  IAccountDevice,
  IAccountProviderService,
  IAccountProxyService,
  IAccountService,
  IAccountTransaction,
  IAction,
  IActionService,
  IApiService,
  IDeviceService,
  IEthService,
  IEvent,
  IEventService,
  IFaucetService,
  ISecureService,
  ISessionService,
  IStorageService,
  IUrlService,
} from './services';
import { IState } from './state';

/**
 * Sdk
 */
export class Sdk implements ISdk {

  constructor(
    public readonly state: IState,
    private readonly accountService: IAccountService,
    private readonly accountProviderService: IAccountProviderService,
    private readonly accountProxyService: IAccountProxyService,
    private readonly actionService: IActionService,
    private readonly apiService: IApiService,
    private readonly deviceService: IDeviceService,
    private readonly ethService: IEthService,
    private readonly eventService: IEventService,
    private readonly faucetService: IFaucetService,
    private readonly secureService: ISecureService,
    private readonly sessionService: ISessionService,
    private readonly storageService: IStorageService,
    private readonly urlService: IUrlService,
  ) {
    this.catchError = this.catchError.bind(this);
  }

  public async initialize(): Promise<void> {
    this.require({
      initialized: false,
      accountConnected: false,
    });

    const { initialized$, connected$, authenticated$, deviceAddress$ } = this.state;
    const deviceAddress = await this.deviceService.setup();

    deviceAddress$.next(deviceAddress);

    await this.state.setup();

    if (await this.sessionService.createSession(deviceAddress)) {
      authenticated$.next(true);

      this.eventService.setup().subscribe(connected$);

      this.subscribeAccountBalance();
      this.subscribeAcceptedActions();
      this.subscribeIncomingEvents();

      initialized$.next(true);

      this.urlService.setup();
      this.actionService.setup();
    }
  }

  public async reset(options: { device?: boolean, session?: boolean } = {}): Promise<void> {
    this.require({
      accountConnected: null,
    });

    this.state.reset();

    if (options.session || options.device) {
      const { authenticated$, deviceAddress$ } = this.state;
      let { deviceAddress } = this.state;

      if (await this.sessionService.resetSession()) {
        authenticated$.next(false);

        if (options.device) {
          deviceAddress = await this.deviceService.reset();
          deviceAddress$.next(deviceAddress);
        }

        if (await this.sessionService.createSession(deviceAddress)) {
          authenticated$.next(true);
        }
      }
    }
  }

  public async getGasPrice(): Promise<IBN> {
    const { gasPrice, gasPrice$ } = this.state;
    let result: IBN = gasPrice;

    try {
      const currentGasPrice = await this.ethService.getGasPrice();
      if (currentGasPrice) {
        result = currentGasPrice;
        gasPrice$.next(result);
      }
    } catch (err) {
      this.catchError(err);
    }

    return result;
  }

  public async getNetworkVersion(): Promise<string> {
    const { networkVersion, networkVersion$ } = this.state;
    let result: string = networkVersion || null;

    if (!networkVersion) {
      try {
        const networkVersion = await this.ethService.getNetworkVersion();
        if (networkVersion) {
          result = networkVersion;
          networkVersion$.next(networkVersion);
        }
      } catch (err) {
        this.catchError(err);
      }
    }

    return result;
  }

  public async getAccounts(): Promise<IAccount[]> {
    this.require({
      accountConnected: false,
    });

    return this.accountService.getAccounts();
  }

  public async createAccount(ensLabel: string = null): Promise<IAccount> {
    this.require({
      accountConnected: false,
    });

    const account = await this.accountProviderService.createAccount(ensLabel);

    return this.setAccount(account);
  }

  public async setAccountEnsLabel(ensLabel: string): Promise<IAccount> {
    this.require();

    const { accountAddress, account$ } = this.state;

    const account = await this.accountProviderService.updateAccount(accountAddress, ensLabel);

    account$.next(account);

    return account;
  }

  public async connectAccount(accountAddress: string): Promise<IAccount> {
    this.require({
      accountConnected: false,
    });

    const account = await this.accountService.getAccount(accountAddress);

    return this.setAccount(account);
  }

  public async verifyAccount(): Promise<IAccount> {
    this.require();

    const { account } = this.state;

    return this.setAccount(account);
  }

  public async disconnectAccount(): Promise<void> {
    this.require();

    const { accountAddress, deviceAddress, account$, accountDevice$ } = this.state;

    await this.accountService.removeAccountDevice(accountAddress, deviceAddress);

    account$.next(null);
    accountDevice$.next(null);
  }

  public async topUpAccount(): Promise<IFaucetService.IReceipt> {
    this.require();

    const { accountAddress } = this.state;

    return this.faucetService.getFunds(accountAddress);
  }

  public async getAccountDevices(): Promise<IAccountDevice[]> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountService.getAccountDevices(accountAddress);
  }

  public async createAccountDevice(deviceAddress: string): Promise<IAccountDevice> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountService.createAccountDevice(accountAddress, deviceAddress);
  }

  public async removeAccountDevice(deviceAddress: string): Promise<void> {
    this.require();

    const { accountAddress } = this.state;

    await this.accountService.removeAccountDevice(accountAddress, deviceAddress);
  }

  public async getAccountTransactions(): Promise<IAccountTransaction[]> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountService.getAccountTransactions(accountAddress);
  }

  public async estimateAccountDeployment(gasPrice: IBN): Promise<IBN> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountProviderService.estimateDeployAccountCost(accountAddress, gasPrice);
  }

  public async estimateAccountDeviceDeployment(deviceAddress: string, gasPrice: IBN): Promise<IAccountProxyService.IEstimatedTransaction> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountProxyService.estimateDeployDevice(accountAddress, deviceAddress, gasPrice);
  }

  public async estimateAccountTransaction(
    to: string,
    value: IBN,
    data: Buffer,
    gasPrice: IBN,
  ): Promise<IAccountProxyService.IEstimatedTransaction> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountProxyService.estimateTransaction(accountAddress, to, value, data, gasPrice);
  }

  public async deployAccount(gasPrice: IBN): Promise<string> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountProviderService.deployAccount(accountAddress, gasPrice);
  }

  public async deployAccountDevice(
    deviceAddress: string,
    estimated: IAccountProxyService.IEstimatedTransaction,
    gasPrice: IBN,
  ): Promise<string> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountProxyService.deployDevice(accountAddress, deviceAddress, estimated, gasPrice);
  }

  public async executeAccountTransaction(
    estimated: IAccountProxyService.IEstimatedTransaction,
    gasPrice: IBN,
  ): Promise<string> {
    this.require();

    const { accountAddress } = this.state;

    return this.accountProxyService.executeTransaction(accountAddress, estimated, gasPrice);
  }

  public acceptIncomingAction(): void {
    this.actionService.acceptAction();
  }

  public dismissIncomingAction(): void {
    this.actionService.dismissAction();
  }

  public processIncomingUrl(url: string): void {
    this.urlService.incoming$.next(url);
  }

  public createRequestAddAccountDeviceUrl(options: { accountAddress?: string, endpoint?: string, callbackEndpoint?: string } = {}): string {
    this.require({
      accountConnected: false,
    });

    const { deviceAddress } = this.state;
    const action = this.actionService.createAction<actionPayload.IRequestAddAccountDevice>(
      ActionTypes.RequestAddAccountDevice,
      {
        deviceAddress,
        accountAddress: options.accountAddress || null,
        callbackEndpoint: options.callbackEndpoint || null,
      },
    );

    return this.urlService.buildActionUrl(action, options.endpoint || null);
  }

  public async createSecureAddDeviceUrl(): Promise<string> {
    this.require();

    const { deviceAddress } = this.state;

    const code = await this.secureService.createSecureCode();
    const action = this.actionService.createAction<actionPayload.IRequestSignSecureCode>(
      ActionTypes.RequestSignSecureCode,
      {
        code,
        creatorAddress: deviceAddress,
      },
    );

    return this.urlService.buildActionUrl(action);
  }

  public createReduxMiddleware(): Middleware {
    const createActionCreator = (type: ReduxActionTypes) => (payload: any) => ({
      type,
      payload,
    });

    return (store: Store) => {
      setTimeout(
        () => {
          merge(
            this.state.account$.pipe(map(createActionCreator(ReduxActionTypes.SetAccount))),
            this.state.accountDevice$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountDevice))),
            this.state.accountBalance$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountBalance))),
            this.state.deviceAddress$.pipe(map(createActionCreator(ReduxActionTypes.SetDeviceAddress))),
            this.state.gasPrice$.pipe(map(createActionCreator(ReduxActionTypes.SetGasPrice))),
            this.state.networkVersion$.pipe(map(createActionCreator(ReduxActionTypes.SetNetworkVersion))),
            this.state.initialized$.pipe(map(createActionCreator(ReduxActionTypes.SetInitialized))),
            this.state.authenticated$.pipe(map(createActionCreator(ReduxActionTypes.SetAuthenticated))),
            this.state.connected$.pipe(map(createActionCreator(ReduxActionTypes.SetConnected))),
            this.actionService.$incoming.pipe(map(createActionCreator(ReduxActionTypes.SetIncomingAction))),
          )
            .subscribe(store.dispatch);
        },
        0,
      );

      return next => action => next(action);
    };
  }

  private require(options: {
    initialized?: boolean;
    accountConnected?: boolean;
  } = {}): void {
    const { account, initialized } = this.state;

    options = {
      initialized: true,
      accountConnected: true,
      ...options,
    };

    if (options.initialized && !initialized) {
      throw new Error('Setup uncompleted');
    }

    if (!options.initialized && initialized) {
      throw new Error('Setup already completed');
    }

    if (options.accountConnected === true && !account) {
      throw new Error('Account disconnected');
    }

    if (options.accountConnected === false && account) {
      throw new Error('Account already connected');
    }
  }

  private async setAccount(account: IAccount): Promise<IAccount> {
    let result: IAccount = null;
    const { account$, accountDevice$, deviceAddress } = this.state;

    try {
      if (account) {
        const accountDevice = await this.accountService.getAccountDevice(account.address, deviceAddress);

        if (accountDevice) {
          account$.next(account);
          accountDevice$.next(accountDevice);

          result = account;
        } else {
          account$.next(null);
        }
      }

    } catch (err) {
      this.catchError(err);

      account$.next(null);
      accountDevice$.next(null);
      result = null;
    }

    return result;
  }

  private subscribeAccountBalance(): void {
    const { account$, accountBalance$ } = this.state;

    account$
      .pipe(
        switchMap(account => account
          ? timer(0, 5000)
            .pipe(
              switchMap(() => from(this.ethService.getBalance(account).catch(() => null))),
              filter(balance => !!balance),
              takeUntil(account$.pipe(filter(account => !account))),
            )
          : of(null),
        ),
      )
      .subscribe(accountBalance$);
  }

  private subscribeAcceptedActions(): void {
    const { account$ } = this.state;

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

        const actionProcessor = async (action: IAction) => {
          const { accountAddress } = this.state;

          if (hasAccount) {
            switch (action.type) {
              case ActionTypes.RequestAddAccountDevice: {
                const { payload: { callbackEndpoint, ...payload } } = action as IAction<actionPayload.IRequestAddAccountDevice>;
                if (
                  payload.deviceAddress &&
                  (
                    !payload.accountAddress ||
                    payload.accountAddress === accountAddress
                  )
                ) {
                  if (
                    await this.createAccountDevice(payload.deviceAddress) &&
                    callbackEndpoint
                  ) {
                    const action = this.actionService.createAction<actionPayload.IAccountDeviceAdded>(
                      ActionTypes.AccountDeviceAdded, {
                        accountAddress,
                      },
                    );

                    this.urlService.openActionUrl(action, callbackEndpoint);
                  }
                }
                break;
              }
            }
          } else {
            switch (action.type) {
              case ActionTypes.AccountDeviceAdded: {
                const { accountAddress } = action.payload as actionPayload.IAccountDeviceAdded;
                if (accountAddress) {
                  await this.connectAccount(accountAddress);
                }
                break;
              }

              case ActionTypes.RequestSignSecureCode: {
                const { creatorAddress, code } = action.payload as actionPayload.IRequestSignSecureCode;
                await this.secureService.signSecureCode(creatorAddress, code);
                break;
              }
            }
          }
        };

        subscription = this
          .actionService
          .$accepted
          .pipe(
            filter(action => !!action),
            switchMap(action => from(
              actionProcessor(action).catch(this.catchError),
            )),
            map(() => null),
          )
          .subscribe(this.actionService.$accepted);
      });
  }

  private subscribeIncomingEvents(): void {
    const eventProcessor = async (event: IEvent) => {
      const { accountAddress, deviceAddress } = this.state;

      switch (event.type) {
        case EventTypes.AccountUpdated:
        case EventTypes.AccountDeviceCreated:
        case EventTypes.AccountDeviceUpdated:
        case EventTypes.AccountDeviceRemoved: {
          const { payload } = event as IEvent<eventPayload.IAccountDevice>;

          switch (event.type) {
            case EventTypes.AccountUpdated: {
              if (accountAddress === payload.accountAddress) {
                const account = await this.accountService.getAccount(accountAddress);
                await this.setAccount(account);
              }
              break;
            }
            case EventTypes.AccountDeviceCreated: {
              if (
                !accountAddress &&
                payload.accountAddress &&
                payload.deviceAddress &&
                payload.deviceAddress === deviceAddress
              ) {
                await this.connectAccount(payload.accountAddress);
              }
              break;
            }
            case EventTypes.AccountDeviceRemoved: {
              if (
                payload.accountAddress === accountAddress &&
                payload.deviceAddress === deviceAddress
              ) {
                await this.reset();
              }
              break;
            }
            case EventTypes.AccountDeviceUpdated: {
              await this.verifyAccount();
              break;
            }
          }
          break;
        }

        case EventTypes.SecureCodeSigned: {
          const { payload: { code, signerAddress } } = event as IEvent<eventPayload.ISecureCode>;


          if (
            accountAddress &&
            signerAddress &&
            this.secureService.verifySecureCode(code)
          ) {
            const action = this.actionService.createAction<actionPayload.IRequestAddAccountDevice>(
              ActionTypes.RequestAddAccountDevice, {
                accountAddress,
                deviceAddress: signerAddress,
              },
            );

            this.actionService.$incoming.next(action);
          }

          break;
        }
      }
    };

    this
      .eventService
      .$incoming
      .pipe(
        filter(event => !!event),
        switchMap(event => from(
          eventProcessor(event).catch(this.catchError),
        )),
        map(() => null),
      )
      .subscribe(this.eventService.$incoming);
  }

  private catchError(err): any {
    this.state.error$.next(err);
    return null;
  }
}
