import { IEnvironment } from './interfaces';

/**
 * Environment
 */
export class Environment implements IEnvironment {

  constructor(private servicesOptions: IEnvironment.IServicesOptions) {
    //
  }

  public getServiceOptions<K extends IEnvironment.TServiceKeys>(
    serviceKey: K,
  ): IEnvironment.IServicesOptions[K] {
    return this.servicesOptions[serviceKey];
  }

  public extendServiceOptions<K extends IEnvironment.TServiceKeys>(
    serviceKey: K,
    serviceOptions: Partial<IEnvironment.IServicesOptions[K]>,
  ): IEnvironment {
    this.servicesOptions[serviceKey] = {
      ...(this.servicesOptions[serviceKey] as any),
      ...(serviceOptions as any),
    };

    return this;
  }
}
