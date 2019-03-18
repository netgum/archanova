export interface ISessionService {
  createSession(deviceAddress: string): Promise<boolean>;

  resetSession(): Promise<boolean>;
}
