import { TUniqueBehaviorSubject } from 'rxjs-addons';

export interface IDeviceService {
  readonly device$: TUniqueBehaviorSubject<IDevice>;
  readonly device: IDevice;

  setup(): Promise<void>;

  reset(): Promise<void>;

  signPersonalMessage(message: string | Buffer): Promise<Buffer>;
}

export interface IDevice {
  address: string;
}
