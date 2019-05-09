import { Api } from './Api';
import { Ens } from './Ens';
import { Eth } from './Eth';
import { Storage } from './Storage';

export class Environment {
  constructor(private configs: Environment.IConfigs) {
    //
  }

  public getConfig<K extends Environment.TKeys>(
    key: K,
  ): Environment.IConfigs[K] {
    return this.configs[key] || null;
  }

  public setConfig<K extends Environment.TKeys>(
    key: K,
    config: Environment.IConfigs[K],
  ): this {
    this.configs[key] = config;
    return this;
  }

  public extendConfig<K extends Environment.TKeys>(
    key: K,
    config: Partial<Environment.IConfigs[K]>,
  ): this {
    this.configs[key] = {
      ...(this.configs[key] as object),
      ...(config as object),
    };
    return this;
  }
}

export namespace Environment {
  export type TKeys = keyof IConfigs;

  export interface IConfigs {
    apiOptions: Api.IOptions;
    apiWebSocketConstructor?: Api.IWebSocketConstructor;
    ensOptions: Ens.IOptions;
    ethOptions: Eth.IOptions;
    storageOptions: Storage.IOptions;
    storageAdapter?: Storage.IAdapter;
  }
}
