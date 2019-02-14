import { IBN } from 'bn.js';
import { inject, injectable } from 'inversify';
import { getEnsNameInfo } from '@netgum/utils';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { TYPES } from '../../constants';
import { IStorage } from '../../storage';
import { IAccountService, IAccount } from '../account';
import { IEthService } from '../eth';
import { PlatformService } from '../platform';
import { IAccountProviderService } from './interfaces';

@injectable()
export class AccountProviderService extends PlatformService implements IAccountProviderService {
  public static TYPES = {
    Options: Symbol('AccountProviderService:Options'),
  };

  public static STORAGE_KEYS = {
    supportedEnsName: 'AccountProviderService/supportedEnsName',
  };

  public supportedEnsName$ = new UniqueBehaviorSubject<string>();

  constructor(
    @inject(AccountProviderService.TYPES.Options) private options: IAccountProviderService.IOptions,
    @inject(TYPES.Storage) private storage: IStorage,
    @inject(TYPES.AccountService) private accountService: IAccountService,
    @inject(TYPES.EthService) private ethService: IEthService,
  ) {
    super(options);
  }

  public get supportedEnsName(): string {
    return this.supportedEnsName$.getValue();
  }

  public async setup(): Promise<void> {
    let supportedEnsName: string = null;

    if (this.storage) {
      supportedEnsName = await this.storage.getItem<string>(AccountProviderService.STORAGE_KEYS.supportedEnsName);
    }

    if (this.options.contractAddress) {
      try {
        const settings = await this.sendGetSettings(this.options.contractAddress);

        if (settings.supportedEnsName !== supportedEnsName) {
          supportedEnsName = settings.supportedEnsName;
          await this.storage.setItem<string>(AccountProviderService.STORAGE_KEYS.supportedEnsName, supportedEnsName);
        }
      } catch (err) {
        //
      }
    }

    if (supportedEnsName) {
      this.supportedEnsName$.next(supportedEnsName);
    }
  }

  public async createAccount(ensName: string = null): Promise<void> {
    if (this.accountService.account) {
      throw new Error('Account already created');
    }

    const { address } = await this.sendCreateAccount(
      this.options.contractAddress,
      this.computeEnsName(ensName),
    );

    await this.accountService.connectAccount(address);
  }

  public async updateAccount(ensName: string): Promise<void> {
    const { account, accountDevice } = this.accountService;

    if (!account || !accountDevice) {
      throw new Error('Invalid account');
    }

    const { address } = await this.sendUpdateAccount(
      this.options.contractAddress,
      account.address,
      this.computeEnsName(ensName),
    );

    await this.accountService.connectAccount(address);
  }

  public async estimateAccountDeployment(): Promise<IAccountProviderService.IDeployment> {
    const { account, accountDevice } = this.accountService;

    if (!account || !accountDevice) {
      throw new Error('Invalid account');
    }

    const gasPrice = await this.ethService.getGasPrice();
    const cost = await this.sendGetDeploymentCost(
      this.options.contractAddress,
      account.address,
      gasPrice,
    );

    return {
      cost,
      gasPrice,
    };
  }

  public async deployAccount(gasPrice: IBN): Promise<boolean> {
    const { account, accountDevice } = this.accountService;

    if (!account || !accountDevice) {
      throw new Error('Invalid account');
    }

    const result = await this.sendDeployAccount(
      this.options.contractAddress,
      account.address,
      gasPrice,
    );

    return result;
  }

  private sendGetSettings(accountProviderAddress: string): Promise<IAccountProviderService.ISettings> {
    return this.sendHttpRequest<IAccountProviderService.ISettings>({
      method: 'GET',
      path: `${accountProviderAddress}/settings`,
    });
  }

  private async sendGetDeploymentCost(accountProviderAddress: string, accountAddress: string, gasPrice: IBN): Promise<IBN> {
    const { refundAmount } = await this.sendHttpRequest<{
      refundAmount: IBN;
    }>({
      method: 'POST',
      path: `${accountProviderAddress}/account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return refundAmount;
  }

  private async sendDeployAccount(accountProviderAddress: string, accountAddress: string, gasPrice: IBN): Promise<boolean> {
    const { hash } = await this.sendHttpRequest<{
      refundAmount: IBN;
      hash: string;
    }>({
      method: 'PUT',
      path: `${accountProviderAddress}/account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return !!hash;
  }

  private async sendCreateAccount(accountProviderAddress: string, ensName: string = null): Promise<IAccount> {
    const { item } = await this.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'POST',
      path: `${accountProviderAddress}/account`,
      body: ensName
        ? { ensName }
        : {},
    });

    return item;
  }

  private async sendUpdateAccount(accountProviderAddress: string, accountAddress: string, ensName: string): Promise<IAccount> {
    const { item } = await this.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'PUT',
      path: `${accountProviderAddress}/account/${accountAddress}`,
      body: {
        ensName,
      },
    });

    return item;
  }

  private computeEnsName(name: string): string {
    let result: string = null;

    if (name) {
      const ensNameInfo = getEnsNameInfo(`${name}.${this.supportedEnsName}`);
      if (ensNameInfo && ensNameInfo.rootNode.name === this.supportedEnsName) {
        result = ensNameInfo.name;
      }
    }
    return result;
  }
}
