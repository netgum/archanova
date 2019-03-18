export interface IDeviceService {
  setup(): Promise<string>;

  reset(): Promise<string>;

  signPersonalMessage(message: string | Buffer): Promise<Buffer>;
}
