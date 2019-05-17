import { Server as HttpServer } from 'http';
import bodyParser from 'body-parser';
import ngrok from 'ngrok';
import express from 'express';
import { jsonReviver } from '@netgum/utils';

export class Server extends HttpServer {
  private handlersPath: string;
  private handlers: {
    get(): any;
    post(body: any): Promise<any>;
  };

  constructor() {
    super();
    const app = express();

    app.use(bodyParser.json({
      reviver: jsonReviver,
    }));

    app.use(this.rebuildHandlersMiddleware.bind(this));
    app.get('/', (req, res, next) => {
      try {
        const data = this.handlers.get();
        res.send(data || null);
      } catch (err) {
        next(err);
      }
    });
    app.post('/', (req, res, next) => {
      try {
        this
          .handlers
          .post(req.body)
          .then(data => res.send(data || null))
          .catch(next);
      } catch (err) {
        next(err);
      }
    });

    const router = express.Router({
      mergeParams: true,
    });

    router.use(((err, req, res, next) => {
      res.status(500);
      res.send({
        error: 'internal server error',
      });

    }) as express.ErrorRequestHandler);

    this.on('request', app);
  }

  public rebuildHandlersMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): void {
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

  public async start(handlersPath: string): Promise<string> {
    this.handlersPath = handlersPath;

    const port = await new Promise<number>(((resolve) => {
      this
        .listen(() => {
          const { port } = this.address() as any;

          resolve(port);
        });
    }));

    return ngrok.connect(port);
  }

  public async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    await ngrok.disconnect();
  }
}
