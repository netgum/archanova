import { sdkInterfaces, sdkConstants } from '@archanova/sdk';
import { Box, Color } from 'ink';
import React from 'react';
import { ContextComponent } from '../context';
import { SdkService } from '../services';

interface IState {
  account: sdkInterfaces.IAccount;
  app: SdkService.IApp;
  device: sdkInterfaces.IDevice;
}

export class Summary extends ContextComponent<{}, IState> {
  public state: IState = {
    account: null,
    app: null,
    device: null,
  };

  public componentWillMount(): void {
    const { sdkService: { state: { app$, account$, device$ } } } = this.context;

    this.addSubscriptions(
      app$
        .subscribe(app => this.setState({
          app,
        })),
      account$
        .subscribe(account => this.setState({
          account,
        })),
      device$
        .subscribe(device => this.setState({
          device,
        })),
    );
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();
  }

  public render(): any {
    const { app, account, device } = this.state;

    return (
      <React.Fragment>
        {!device ? null : (
          <Box marginBottom={1}>
            <Color magenta={true}>
              {'Device '}
            </Color>
            {device.address}
          </Box>
        )}
        {!account ? null : (
          <Box marginBottom={1}>
            <Color magenta={true}>
              {'Account '}
            </Color>
            {account.address}
            {account.type === sdkConstants.AccountTypes.Developer ? null : (
              <Color redBright={true}>
                {' (Non-Developer)'}
              </Color>
            )}
          </Box>
        )}
        {!app ? null : (
          <Box marginBottom={1}>
            <Color magenta={true}>
              {'Application '}
            </Color>
            {app.name}
            <Color blueBright={true}>
              {` (${app.alias})`}
            </Color>
          </Box>
        )}
      </React.Fragment>
    );
  }
}
