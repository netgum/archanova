import { inject, injectable } from 'inversify';
import { Subject, EMPTY, Observable, from } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { TYPES } from '../../constants';
import { IAccountService } from '../account';
import { IDeviceService } from '../device';
import { IPlatformService, PlatformService } from '../platform';
import { INotificationService } from './interfaces';
import { NotificationEventTypes } from './constants';

@injectable()
export class NotificationService extends PlatformService implements INotificationService {
  public static TYPES = {
    Options: Symbol('NotificationService:Options'),
  };

  public connected$ = new UniqueBehaviorSubject<boolean>(null);

  public event$ = new Subject<INotificationService.IEvent>();

  constructor(
    @inject(NotificationService.TYPES.Options) options: IPlatformService.IOptions,
    @inject(TYPES.AccountService) private accountService: IAccountService,
    @inject(TYPES.DeviceService) private deviceService: IDeviceService,
  ) {
    super(options);
  }

  public get connected(): boolean {
    return this.connected$.getValue();
  }

  public setup(): void {
    const { connected$, message$ } = this.buildWsSubjects(3000);

    connected$
      .subscribe(this.connected$);

    message$
      .subscribe(this.event$);

    this
      .event$
      .pipe(
        filter(event => !!event),
        switchMap(({ type, payload }) => {
          let result: Observable<any> = EMPTY;

          console.log({
            type,
            payload,
          });

          switch (type) {
            case NotificationEventTypes.AccountUpdated: {
              const { accountAddress } = payload as INotificationService.IAccountDeviceEventPayload;
              if (
                this.accountService.account &&
                this.accountService.account.address === accountAddress
              ) {
                result = from(this.accountService.fetchAccount().catch(() => null));
              }
              break;
            }

            case NotificationEventTypes.AccountDeviceCreated: {
              const { accountAddress, deviceAddress } = payload as INotificationService.IAccountDeviceEventPayload;
              if (
                !this.accountService.account &&
                this.deviceService.device.address === deviceAddress
              ) {
                result = from(this.accountService.connectAccount(accountAddress).catch(() => null));
              }
              break;
            }

            case NotificationEventTypes.AccountDeviceRemoved: {
              const { accountAddress, deviceAddress } = payload as INotificationService.IAccountDeviceEventPayload;
              if (
                this.accountService.account &&
                this.accountService.account.address === accountAddress &&
                this.deviceService.device.address === deviceAddress
              ) {
                result = from(this.accountService.disconnectAccountDevice().catch(() => null));
              }
              break;
            }

            case NotificationEventTypes.AccountDeviceUpdated: {
              const { accountAddress, deviceAddress } = payload as INotificationService.IAccountDeviceEventPayload;
              if (
                this.accountService.account &&
                this.accountService.account.address === accountAddress &&
                this.deviceService.device.address === deviceAddress
              ) {
                result = from(this.accountService.fetchAccountDevice().catch(() => null));
              }
              break;
            }
          }

          return result;
        }),
      )
      .subscribe();
  }
}
