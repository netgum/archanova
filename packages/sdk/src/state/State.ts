import { IBN } from 'bn.js';
import { from, Subject } from 'rxjs';
import { UniqueBehaviorSubject, TUniqueBehaviorSubject } from 'rxjs-addons';
import { skip, switchMap } from 'rxjs/operators';
import { IStorageService, IAccount, IAccountDevice } from '../services';
import { IState } from './interfaces';

export class State implements IState {
  public static STORAGE_NAMESPACE = 'State';

  public error$ = new Subject<any>();
  public account$ = new UniqueBehaviorSubject<IAccount>();
  public accountDevice$ = new UniqueBehaviorSubject<IAccountDevice>();
  public accountBalance$ = new UniqueBehaviorSubject<IBN>();
  public deviceAddress$ = new UniqueBehaviorSubject<string>();
  public gasPrice$ = new UniqueBehaviorSubject<IBN>();
  public networkVersion$ = new UniqueBehaviorSubject<string>();
  public initialized$ = new UniqueBehaviorSubject<boolean>(false);
  public authenticated$ = new UniqueBehaviorSubject<boolean>(false);
  public connected$ = new UniqueBehaviorSubject<boolean>(null);

  public get account(): IAccount {
    return this.account$.getValue();
  }

  public get accountAddress(): string {
    return this.account ? this.account.address : null;
  }

  public get accountDevice(): IAccountDevice {
    return this.accountDevice$.getValue();
  }

  public get accountBalance(): IBN {
    return this.accountBalance$.getValue();
  }

  public get deviceAddress(): string {
    return this.deviceAddress$.getValue();
  }

  public get gasPrice(): IBN {
    return this.gasPrice$.getValue();
  }

  public get networkVersion(): string {
    return this.networkVersion$.getValue();
  }

  public get initialized(): boolean {
    return this.initialized$.getValue();
  }

  public get authenticated(): boolean {
    return this.authenticated$.getValue();
  }

  public get connected(): boolean {
    return this.connected$.getValue();
  }

  constructor(public storageService: IStorageService) {
    //
  }

  public async setup(): Promise<void> {
    this.reset();

    await Promise.all([
      this.attachToStorage(this.account$, 'account'),
      this.attachToStorage(this.accountDevice$, 'accountDevice'),
      this.attachToStorage(this.networkVersion$, 'networkVersion'),
      this.attachToStorage(this.gasPrice$, 'gasPrice'),
    ]);
  }

  public reset(): void {
    this.account$.next(null);
    this.accountDevice$.next(null);
  }

  private async attachToStorage(subject: TUniqueBehaviorSubject, key: string): Promise<void> {
    key = `${State.STORAGE_NAMESPACE}/${key}`;

    const value = await this.storageService.getItem(key);
    if (value) {
      subject.next(value);
    }

    subject
      .pipe(
        skip(1),
        switchMap(value =>
          from(this.storageService.setItem(key, value).catch(() => null)),
        ),
      )
      .subscribe();
  }
}
