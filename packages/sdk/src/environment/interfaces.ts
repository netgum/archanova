import { IAccountProviderService } from '../services/account-provider';
import { IAccountProxyService } from '../services/account-proxy';
import { IEnsService } from '../services/ens';
import { IEthService } from '../services/eth';
import { ILinkingService } from '../services/linking';
import { IPlatformService } from '../services/platform';

export interface IEnvironment {
  getServiceOptions<K extends IEnvironment.TServiceKeys>(
    serviceKey: K,
  ): IEnvironment.IServicesOptions[K];

  extendServiceOptions<K extends IEnvironment.TServiceKeys>(
    serviceKey: K,
    serviceOptions: Partial<IEnvironment.IServicesOptions[K]>,
  ): IEnvironment;
}

export namespace IEnvironment {
  export type TServiceKeys = keyof IServicesOptions;

  export interface IServicesOptions {
    account: IPlatformService.IOptions;
    accountProvider: IAccountProviderService.IOptions;
    accountProxy: IAccountProxyService.IOptions;
    ens: IEnsService.IOptions;
    eth: IEthService.IOptions;
    linking: ILinkingService.IOptions;
    notification: IPlatformService.IOptions;
    session: IPlatformService.IOptions;
  }

  export interface IBuildLocalOptions  {
    platformHost?: string;
    platformStartPort: number;
    ethProviderPort?: number;
  }
}
