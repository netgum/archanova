import { from } from 'rxjs';
import { map, skip, switchMap } from 'rxjs/operators';
import { UniqueBehaviorSubject, TUniqueBehaviorSubject } from 'rxjs-addons';
import { Sdk, sdkModules, sdkInterfaces, sdkConstants } from '@archanova/sdk';

export class SdkService extends Sdk {
  public state: sdkModules.State & {
    app$: TUniqueBehaviorSubject<SdkService.IApp>;
    app: SdkService.IApp;
    hasDeveloperAccount$: TUniqueBehaviorSubject<boolean>;
    hasDeveloperAccount: boolean;
  };

  constructor(environment: sdkModules.Environment) {
    super(environment);

    this.state.app$ = new UniqueBehaviorSubject<SdkService.IApp>(null);
    this.state.hasDeveloperAccount$ = new UniqueBehaviorSubject<boolean>(false);

    this
      .state
      .account$
      .pipe(
        map(account => account && account.type === sdkConstants.AccountTypes.Developer),
      )
      .subscribe(this.state.hasDeveloperAccount$);

    Object.defineProperty(this.state, 'app', {
      get: () => this.state.app$.value,
    });

    Object.defineProperty(this.state, 'hasDeveloperAccount', {
      get: () => this.state.hasDeveloperAccount$.value,
    });
  }

  public async becomeDeveloper(code: string): Promise<boolean> {
    this.require();
    const { accountAddress } = this.state;
    const account = await this
      .api
      .sendRequest({
        method: 'PUT',
        path: `developer/${accountAddress}`,
        body: {
          code,
        },
      })
      .catch(() => null);

    if (account) {
      this.state.account$.next(account);
    }

    return !!account;
  }

  public async initializeDeveloperApp(): Promise<boolean> {
    const app = await this.storage.getItem<SdkService.IApp>('app');

    if (app) {
      this.state.app$.next(app);
    }

    this
      .state
      .app$
      .pipe(
        skip(1),
        switchMap(value =>
          from(this.storage.setItem('app', value).catch(() => null)),
        ),
      )
      .subscribe();

    return !!app;
  }

  public selectDeveloperApp(app): void {
    this.state.app$.next(app);
  }

  public async getDeveloperApp(alias: string): Promise<SdkService.IApp> {
    this.require();

    const { accountAddress } = this.state;

    return this.api.sendRequest<SdkService.IApp>({
      method: 'GET',
      path: `developer/${accountAddress}/app/${alias}`,
    });
  }

  public async getDeveloperApps(): Promise<sdkInterfaces.IPaginated<SdkService.IApp>> {
    this.require();

    const { accountAddress } = this.state;

    return this.api.sendRequest({
      method: 'GET',
      path: `developer/${accountAddress}/app`,
    });
  }

  public async createDeveloperApp(body: Partial<SdkService.IApp>): Promise<SdkService.IApp> {
    this.require();

    const { accountAddress } = this.state;
    const app = await this.api.sendRequest<SdkService.IApp>({
      body,
      method: 'POST',
      path: `developer/${accountAddress}/app`,
    });

    this.state.app$.next(app);

    return app;
  }

  public async updateDeveloperApp(body: Partial<SdkService.IApp>): Promise<SdkService.IApp> {
    this.require();

    const { accountAddress, app: { alias } } = this.state;
    const app = await this.api.sendRequest<SdkService.IApp>({
      body,
      method: 'PUT',
      path: `developer/${accountAddress}/app/${alias}`,
    });

    this.state.app$.next(app);

    return app;
  }
}

export namespace SdkService {
  export interface IApp extends sdkInterfaces.IApp {
    callbackUrl?: string;
  }
}
