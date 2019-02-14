import { jsonReplacer, jsonReviver } from '@netgum/utils';
import { injectable, unmanaged } from 'inversify';
import { Subject } from 'rxjs';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { delay } from 'rxjs/operators';
import { IPlatformService } from './interfaces';
import { PlatformError } from './PlatformError';

@injectable()
export abstract class PlatformService<T extends IPlatformService.IOptions = IPlatformService.IOptions> implements IPlatformService {

  protected static sessionToken$ = new UniqueBehaviorSubject<string>(null);

  protected static get sessionToken(): string {
    return this.sessionToken$.getValue();
  }

  private readonly wsEndpoint: string = null;
  private readonly httpEndpoint: string = null;

  constructor(
    @unmanaged() { host, port, useSsl }: T,
  ) {
    const endpointBase = `${useSsl ? 's' : ''}://${host || 'localhost'}${port ? `:${port}` : ''}`;
    this.wsEndpoint = `ws${endpointBase}`;
    this.httpEndpoint = `http${endpointBase}`;
  }

  protected buildWsSubjects(reconnectTimeout: number = 0): IPlatformService.IWsSubjects {
    const connected$ = new UniqueBehaviorSubject<boolean>(null);
    const message$ = new Subject<any>();
    const reconnected$ = new Subject<boolean>();

    let ws: WebSocket = null;

    const openHandler = () => connected$.next(true);
    const closeHandler = () => {
      connected$.next(false);
      reconnected$.next(true);
    };
    const errorHandler = () => ws.close();
    const messageHandler = ({ data }: WebSocketEventMap['message']) => {
      try {
        const message = JSON.parse(data, jsonReviver);
        if (message) {
          message$.next(message);
        }
      } catch (err) {
        //
      }
    };

    const connect = () => {
      if (!ws && PlatformService.sessionToken) {
        connected$.next(null);

        ws = new WebSocket(this.wsEndpoint, PlatformService.sessionToken);
        ws.binaryType = 'blob';

        ws.addEventListener('open', openHandler);
        ws.addEventListener('close', closeHandler);
        ws.addEventListener('error', errorHandler);
        ws.addEventListener('message', messageHandler);
      }
    };

    const disconnect = () => {
      if (ws) {
        connected$.next(false);

        ws.removeEventListener('open', openHandler);
        ws.removeEventListener('close', closeHandler);
        ws.removeEventListener('error', errorHandler);
        ws.removeEventListener('message', messageHandler);
        ws.close();
        ws = null;
      }
    };

    PlatformService
      .sessionToken$
      .subscribe(token => token ? connect() : disconnect());

    if (reconnectTimeout) {
      reconnected$
        .pipe(delay(reconnectTimeout))
        .subscribe(() => {
          disconnect();
          connect();
        });
    }

    return {
      connected$,
      message$,
    };
  }

  protected async sendHttpRequest<T = any, B = any>(req: IPlatformService.IHttpRequest<B>): Promise<T> {
    const { method, path, body, dontUseReplacer } = req;

    let status: number = null;
    let data: T = null;

    try {
      const options: RequestInit = {
        method,
        headers: new Headers({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Session-Token': PlatformService.sessionToken || '',
          Pragma: 'no-cache',
        }),
        ...(
          method !== 'GET' &&
          method !== 'HEAD'
            ? { body: JSON.stringify(body || {}, dontUseReplacer ? undefined : jsonReplacer) }
            : {}
        ),
      };

      const res = await fetch(`${this.httpEndpoint}/${path || ''}`, options);

      ({ status } = res);
      data = JSON.parse(await res.text(), dontUseReplacer ? undefined : jsonReviver);
    } catch (err) {
      data = {} as any;
    }

    switch (status) {
      case 400:
        throw new PlatformError(PlatformError.Types.BadRequest, data);

      case 401:
        throw new PlatformError(PlatformError.Types.Unauthorized, data);

      case 403:
        throw new PlatformError(PlatformError.Types.Forbidden, data);

      case 404:
        throw new PlatformError(PlatformError.Types.NotFound, data);

      case 500:
      case null:
        throw new PlatformError(PlatformError.Types.Failed, data);
    }

    return data;
  }
}
