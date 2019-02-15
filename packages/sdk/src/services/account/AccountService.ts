import * as BN from 'bn.js';
import { inject, injectable } from 'inversify';
import { from, of, timer, EMPTY, Observable } from 'rxjs';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { skip, switchMap } from 'rxjs/operators';
import { TYPES } from '../../constants';
import { IStorage } from '../../storage';
import { IDeviceService } from '../device';
import { IEthService } from '../eth';
import { ILinkingService } from '../linking';
import { IPlatformService, PlatformService } from '../platform';
import { AccountDeviceStates, AccountDeviceTypes } from './constants';
import { IAccount, IAccountDevice, IAccountLinkingActions, IAccountService, IAccountTransaction } from './interfaces';

@injectable()
export class AccountService extends PlatformService implements IAccountService {
  public static TYPES = {
    Options: Symbol('AccountService:Options'),
  };

  public static STORAGE_KEYS = {
    account: 'AccountService/account',
    accountDevice: 'AccountService/accountDevice',
  };

  public account$ = new UniqueBehaviorSubject<IAccount>(null);
  public accountBalance$ = new UniqueBehaviorSubject<BN.IBN>(null);
  public accountDevice$ = new UniqueBehaviorSubject<IAccountDevice>(null);

  constructor(
    @inject(AccountService.TYPES.Options) options: IPlatformService.IOptions,
    @inject(TYPES.Storage) private storage: IStorage,
    @inject(TYPES.DeviceService) private deviceService: IDeviceService,
    @inject(TYPES.EthService) private ethService: IEthService,
    @inject(TYPES.LinkingService) private linkingService: ILinkingService,
  ) {
    super(options);
  }

  public get account(): IAccount {
    return this.account$.getValue();
  }

  public get accountBalance(): BN.IBN {
    return this.accountBalance$.getValue();
  }

  public get accountDevice(): IAccountDevice {
    return this.accountDevice$.getValue();
  }

  public async setup(): Promise<void> {
    if (this.storage) {
      const account = await this.storage.getItem<IAccount>(AccountService.STORAGE_KEYS.account);
      const accountDevice = await this.storage.getItem<IAccountDevice>(AccountService.STORAGE_KEYS.accountDevice);

      if (account && accountDevice) {
        this.account$.next(account);
        this.accountDevice$.next(accountDevice);
      }

      this
        .account$
        .pipe(
          skip(1),
          switchMap(account =>
            from(this.storage.setItem(AccountService.STORAGE_KEYS.account, account).catch(() => null)),
          ),
        ).subscribe();

      this
        .accountDevice$
        .pipe(
          skip(1),
          switchMap(accountDevice =>
            from(this.storage.setItem(AccountService.STORAGE_KEYS.accountDevice, accountDevice).catch(() => null)),
          ),
        ).subscribe();

    }

    if (
      this.account &&
      this.accountDevice
    ) {
      try {
        const { device } = this.deviceService;
        const account = await this.sendGetAccount(this.account.address);
        const accountDevice = await this.sendGetAccountDevice(this.account.address, device.address);

        if (account && accountDevice) {
          this.account$.next(account);
          this.accountDevice$.next(accountDevice);
        } else {
          this.account$.next(null);
          this.accountDevice$.next(null);
        }
      } catch (err) {
        //
      }
    }

    this
      .account$
      .pipe(
        switchMap(account => account
          ? timer(0, 3000)
            .pipe(
              switchMap(() => this.ethService.getBalance(account).catch(() => null)),
            )
          : of(null),
        ),
      )
      .subscribe(this.accountBalance$);

    this
      .linkingService
      .incomingActionUrl$
      .pipe(
        switchMap((actionUrl) => {
          let result: Observable<any> = EMPTY;

          try {
            if (actionUrl) {
              const { action: { type, payload } } = actionUrl;

              switch (type) {
                case IAccountLinkingActions.Types.AddAccountDeviceRequest:
                  const { accountAddress, deviceAddress } = payload as IAccountLinkingActions.IAddAccountDeviceRequestPayload;
                  if (
                    !accountAddress ||
                    this.account.address === accountAddress
                  ) {
                    result = from(this.createAccountDevice(deviceAddress));
                  }
                  break;
              }
            }
          } catch (err) {
            result = EMPTY;
          }

          return result;
        }),
      )
      .subscribe();
  }

  public reset(): void {
    this.account$.next(null);
    this.accountDevice$.next(null);
  }

  public async connectAccount(accountAddress: string): Promise<ILinkingService.TUrlCreator> {
    let result: ILinkingService.TUrlCreator = null;
    const account = await this.sendGetAccount(accountAddress);

    if (account) {
      const { device } = this.deviceService;

      const accountDevice = await this.sendGetAccountDevice(accountAddress, device.address);

      if (accountDevice) {
        this.account$.next(account);
        this.accountDevice$.next(accountDevice);
      } else {
        result = this.requestAddAccountDevice(account.address);
      }
    }

    return result;
  }

  public getAccounts(): Promise<IAccount[]> {
    return this.sendGetAccounts();
  }

  public async getAccountDevice(): Promise<IAccountDevice[]> {
    let result: IAccountDevice[] = null;

    if (this.account) {
      result = await this.sendGetAccountDevices(this.account.address);
    }

    return result;
  }

  public async getAccountTransactions(): Promise<IAccountTransaction[]> {
    let result: IAccountTransaction[] = null;

    if (this.account) {
      result = await this.sendGetAccountTransactions(this.account.address);
    }

    return result;
  }

  public requestAddAccountDevice(accountAddress: string = null): ILinkingService.TUrlCreator {
    const { address: deviceAddress } = this.deviceService.device;

    return this.linkingService.createActionUrl<IAccountLinkingActions.IAddAccountDeviceRequestPayload>({
      type: IAccountLinkingActions.Types.AddAccountDeviceRequest,
      payload: {
        accountAddress,
        deviceAddress,
      },
    });
  }

  public async createAccountDevice(deviceAddress: string): Promise<boolean> {
    let result = false;

    if (
      this.account &&
      this.accountDevice &&
      this.accountDevice.type === AccountDeviceTypes.Owner
    ) {
      result = await this.sendCreateAccountDevice(this.account.address, deviceAddress).catch(() => null);
    }

    return result;
  }

  public async removeAccountDevice(deviceAddress: string): Promise<boolean> {
    let result = false;

    if (
      this.account &&
      this.accountDevice &&
      this.accountDevice.type === AccountDeviceTypes.Owner
    ) {
      result = await this.sendRemoveAccountDevice(this.account.address, deviceAddress).catch(() => null);
    }

    return result;
  }

  public async disconnectAccountDevice(): Promise<boolean> {
    let result = false;

    if (
      this.account &&
      this.accountDevice &&
      this.accountDevice.state === AccountDeviceStates.Created
    ) {
      try {
        await this.removeAccountDevice(this.deviceService.device.address);
      } catch (err) {
        //
      }

      this.account$.next(null);
      this.accountDevice$.next(null);
      result = true;
    }

    return result;
  }

  public async fetchAccount(): Promise<void> {
    if (
      this.account
    ) {
      try {
        const account = await this.sendGetAccount(this.account.address);
        this.account$.next(account);
      } catch (err) {
        //
      }
    }
  }

  public async fetchAccountDevice(): Promise<void> {
    if (
      this.account &&
      this.accountDevice
    ) {
      try {
        const accountDevice = await this.sendGetAccountDevice(
          this.account.address,
          this.accountDevice.device.address,
        );

        this.accountDevice$.next(accountDevice);
      } catch (err) {
        //
      }
    }
  }

  public async lookupAccountAddress(ensName: string): Promise<string> {
    let result: string = null;
    try {

      const { address } = await this.sendHttpRequest<{
        address: string;
      }>({
        method: 'GET',
        path: `account/lookup/${ensName}`,
      });
      result = address;
    } catch (err) {
      result = null;
    }

    return result;
  }

  private async sendGetAccounts(): Promise<IAccount[]> {
    const { items } = await this.sendHttpRequest<{
      items: IAccount[];
    }>({
      method: 'GET',
      path: 'account',
    });

    return items;
  }

  private async sendGetAccount(accountAddress: string): Promise<IAccount> {
    const { item } = await this.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'GET',
      path: `account/${accountAddress}`,
    });

    return item;
  }

  private async sendGetAccountDevices(accountAddress: string): Promise<IAccountDevice[]> {
    const { items } = await this.sendHttpRequest<{
      items: IAccountDevice[];
    }>({
      method: 'GET',
      path: `account/${accountAddress}/device`,
    });

    return items;
  }

  private async sendGetAccountTransactions(accountAddress: string): Promise<IAccountTransaction[]> {
    const { items } = await this.sendHttpRequest<{
      items: IAccountTransaction[];
    }>({
      method: 'GET',
      path: `account/${accountAddress}/transaction`,
    });

    return items;
  }

  private async sendGetAccountDevice(accountAddress: string, deviceAddress: string): Promise<IAccountDevice> {
    const { item } = await this.sendHttpRequest<{
      item: IAccountDevice;
    }>({
      method: 'GET',
      path: `account/${accountAddress}/device/${deviceAddress}`,
    });

    return item;
  }

  private async sendCreateAccountDevice(accountAddress: string, deviceAddress: string): Promise<boolean> {
    const { success } = await this.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'POST',
      path: `account/${accountAddress}/device/${deviceAddress}`,
    });

    return success;
  }

  private async sendRemoveAccountDevice(accountAddress: string, deviceAddress: string): Promise<boolean> {
    const { success } = await this.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: `account/${accountAddress}/device/${deviceAddress}`,
    });

    return success;
  }
}
