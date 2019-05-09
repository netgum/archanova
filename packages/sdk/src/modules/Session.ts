import { Api } from './Api';
import { Device } from './Device';
import { State } from './State';

export class Session {
  constructor(
    private api: Api,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public async setup(): Promise<void> {
    if (
      this.state.session &&
      !(await this.verifyToken())
    ) {
      this.state.session$.next(null);
    }

    if (!this.state.session) {
      const token = await this.createToken();

      this.state.session$.next({
        token,
      });
    }
  }

  public async reset(): Promise<void> {
    if (this.state.session) {
      await this.destroyToken();
      this.state.session$.next(null);
    }
  }

  public async createToken(): Promise<string> {
    const { deviceAddress: device } = this.state;

    // create session code
    const { hash } = await this.api.sendRequest<{
      hash: string;
    }, {
      device: string;
    }>({
      method: 'POST',
      path: 'session/hash',
      body: {
        device,
      },
    });

    const signature = this.device.signPersonalMessage(hash);

    // create session token
    const { token } = await this.api.sendRequest<{
      token: string;
    }, {
      device: string;
      hash: string;
      signature: Buffer;
    }>({
      method: 'POST',
      path: 'session',
      body: {
        device,
        hash,
        signature,
      },
    });

    return token;
  }

  public async verifyToken(): Promise<boolean> {
    let result: boolean = true;
    try {

      await this.api.sendRequest<{
        success: boolean;
      }>({
        method: 'GET',
        path: 'session',
      });
    } catch (err) {
      result = false;
    }

    return result;
  }

  public async destroyToken(): Promise<boolean> {
    let result: boolean = true;

    try {
      await this.api.sendRequest<{
        success: boolean;
      }>({
        method: 'DELETE',
        path: 'session',
      });

    } catch (err) {
      result = false;
    }
    return result;
  }
}
