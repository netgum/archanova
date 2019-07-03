import React from 'react';
import { Box, Color } from 'ink';
import { ContextComponent } from '../context';
import { Spinner } from '../components';
import { SdkService } from '../services';
import Link from 'ink-link';

interface IState {
  app: SdkService.IApp;
  oldCallbackUrl: string;
}

export class DevelopAction extends ContextComponent<{}, IState> {
  public state: IState = {
    app: null,
    oldCallbackUrl: null,
  };

  public componentWillMount(): void {
    this.exitHandler = this.exitHandler.bind(this);

    const { sdkService, templateService, serverService } = this.context;
    let { app } = sdkService.state;
    const { callbackUrl: oldCallbackUrl } = app;

    this.wrapAsync(async () => {

      if (!await templateService.templateExists()) {
        await templateService.createTemplate(app);
      }

      const callbackUrl = await serverService.start();

      app = await sdkService.updateDeveloperApp({
        callbackUrl,
      });

      this.setState({
        app,
        oldCallbackUrl,
      });

      process.on('SIGINT', this.exitHandler);
    });
  }

  public componentWillUnmount(): void {
    process.removeListener('SIGINT', this.exitHandler);
  }

  public render(): any {
    const { app } = this.state;
    return app
      ? (
        <Box>
          <Color green={true}>Temporary Callback URL </Color>
          <Link url={app.callbackUrl}>{app.callbackUrl}</Link>
        </Box>
      )
      : (
        <Spinner>Starting Local Server...</Spinner>
      );
  }

  private exitHandler(): void {
    const { sdkService, serverService } = this.context;
    const { oldCallbackUrl: callbackUrl } = this.state;

    this.wrapAsync(async () => {

      try {
        await sdkService.updateDeveloperApp({
          callbackUrl,
        });

        await serverService.stop();
      } catch (err) {
        //
      }

      setTimeout(() => {
        process.exit();
      }, 500);
    });
  }
}
