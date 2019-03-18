import { IEnvironment } from './interfaces';

export class Environment implements IEnvironment {

  constructor(private options: IEnvironment.IOptions) {
    //
  }

  public getOptions<K extends IEnvironment.TKeys>(
    key: K,
  ): IEnvironment.IOptions[K] {
    return this.options[key];
  }

  public extendOptions<K extends IEnvironment.TKeys>(
    key: K,
    options: Partial<IEnvironment.IOptions[K]>,
  ): IEnvironment {
    this.options[key] = {
      ...(this.options[key] as any),
      ...(options as any),
    };

    return this;
  }
}
