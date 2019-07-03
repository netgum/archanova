import { Server } from 'http';
import { join } from 'path';
import { Subject } from 'rxjs';
import bodyParser from 'body-parser';
import ngrok from 'ngrok';
import express from 'express';

export class ServerService {
  private readonly handlersPath: string;
  private readonly server: Server;
  private handlers: ServerService.IHandlers;

  public event$ = new Subject<ServerService.IEvent>();

  constructor(workingPath: string) {
    this.handlersPath = join(workingPath, 'src', 'handlers.js');

    const app = express();

    app.use(this.rebuildHandlersMiddleware.bind(this));

    app.get('/', (req, res, next) => {
      try {
        const data = this.handlers.get();
        res.send(data);
      } catch (err) {
        next(err);
      }
    });

    app.post('/', bodyParser.json({}), ({ body }, res, next) => {
      try {
        this
          .handlers
          .post(body)
          .then((data) => {
            if (!data) {
              res.status(400);
              res.send({
                error: 'bad request',
              });
            } else {
              res.send(data);
            }
          })
          .catch(next);
      } catch (err) {
        next(err);
      }
    });

    app.use(((err, req, res, next) => {
      res.status(500);
      res.send({
        error: 'internal server error',
      });

    }) as express.ErrorRequestHandler);

    this.server = new Server(app);
  }

  public async start(): Promise<string> {
    const port = await new Promise<number>(((resolve) => {
      this
        .server
        .listen(() => {
          const { port } = this.server.address() as any;
          resolve(port);
        });
    }));

    return ngrok.connect(port);
  }

  public async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this
        .server
        .close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    });

    await ngrok.disconnect();
  }

  private rebuildHandlersMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): void {
    try {

      delete require.cache[require.resolve(this.handlersPath)];
      const { get, post } = require(this.handlersPath) as {
        get(): any;
        post(body: any): Promise<any>
      };

      this.handlers = {
        get,
        post,
      };

      next();
    } catch (err) {
      next(err);
    }
  }
}

export namespace ServerService {
  export interface IHandlers {
    get(): any;

    post(body: any): Promise<any>;
  }

  export interface IEvent {
    request: any;
    response: any;
  }
}
