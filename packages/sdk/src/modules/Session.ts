import { Api } from './Api';
import { Device } from './Device';
import { State } from './State';

export class Session {
  private code: string;

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

  public async reset({ token }: { token?: boolean } = {}): Promise<void> {
    this.code = null;

    if (token && this.state.session) {
      await this.destroyToken();
      this.state.session$.next(null);

      const token = await this.createToken();

      this.state.session$.next({
        token,
      });
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
      await this.api.sendRequest({
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
      await this.api.sendRequest({
        method: 'DELETE',
        path: 'session',
      });

    } catch (err) {
      result = false;
    }
    return result;
  }

  public async createCode(): Promise<string> {
    const { code } = await this.api.sendRequest<{
      code: string;
    }>({
      method: 'POST',
      path: 'session/code',
    });

    this.code = code;

    return code;
  }

  public async destroyCode(): Promise<void> {
    await this.api.sendRequest({
      method: 'DELETE',
      path: 'session/code',
    });

    this.code = null;
  }

  public async signCode(creator: string, code: string): Promise<boolean> {
    const signature = this.device.signPersonalMessage(code);

    const { success } = await this.api.sendRequest<{
      success: boolean;
    }>({
      method: 'PUT',
      path: 'session/code',
      body: {
        creator,
        signature,
      },
    });

    return success;
  }

  public verifyCode(code: string): boolean {
    const result = (
      code &&
      this.code &&
      code === this.code
    );

    this.code = null;

    return result;
  }
}
