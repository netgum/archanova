import {
  IAccountProviderService,
  IAccountProxyService,
  IActionService,
  IApiService,
  IEthService,
  IUrlService,
  IStorageService,
} from '../services';

export interface IEnvironment {
  getOptions<K extends IEnvironment.TKeys>(
    key: K,
  ): IEnvironment.IOptions[K];

  extendOptions<K extends IEnvironment.TKeys>(
    key: K,
    options: Partial<IEnvironment.IOptions[K]>,
  ): IEnvironment;
}

export namespace IEnvironment {
  export type TKeys = keyof IOptions;

  export interface IOptions {
    accountProvider: IAccountProviderService.IOptions;
    accountProxy: IAccountProxyService.IOptions;
    action: IActionService.IOptions;
    api: IApiService.IOptions;
    eth: IEthService.IOptions;
    url: IUrlService.IOptions;
    storage: IStorageService.IOptions;
  }
}
