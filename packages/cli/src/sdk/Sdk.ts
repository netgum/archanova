import { Sdk as SdkOrg, sdkModules, sdkInterfaces } from '@archanova/sdk';

export class Sdk extends SdkOrg {
  constructor(environment: sdkModules.Environment) {
    super(environment);
  }

  public async becomeDeveloper(code: string): Promise<sdkInterfaces.IAccount> {
    this.require();
    const { accountAddress } = this.state;
    const account = await this.api.sendRequest({
      method: 'PUT',
      path: `developer/${accountAddress}`,
      body: {
        code,
      },
    });

    this.state.account$.next(account);

    return account;
  }

  public async getDeveloperApp(): Promise<sdkInterfaces.IApp> {
    return this.storage.getItem('app');
  }

  public async createDeveloperApp(name: string): Promise<sdkInterfaces.IApp> {
    this.require();
    const { accountAddress } = this.state;
    const { callbackUrl, ...app } = await this.api.sendRequest<sdkInterfaces.IApp & { callbackUrl: string }>({
      method: 'POST',
      path: `developer/${accountAddress}/app`,
      body: {
        name,
      },
    });

    await this.storage.setItem('app', app);

    return app;
  }

  public async updateDeveloperApp(appAlias: string, callbackUrl: string): Promise<sdkInterfaces.IApp> {
    this.require();
    const { accountAddress } = this.state;
    return this.api.sendRequest<sdkInterfaces.IApp>({
      method: 'PUT',
      path: `developer/${accountAddress}/app/${appAlias}`,
      body: {
        callbackUrl,
      },
    });
  }
}
