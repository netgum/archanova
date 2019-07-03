import { sdkInterfaces, sdkConstants } from '@archanova/sdk';
import React from 'react';
import { Box, Color } from 'ink';
import TextInput from 'ink-text-input';
import { QrCode } from '../components';
import { ContextComponent } from '../context';

interface IState {
  account: sdkInterfaces.IAccount;
  url: string;
  code: string;
}

export class AuthAction extends ContextComponent<{}, IState> {
  public state: IState = {
    account: null,
    url: null,
    code: '',
  };

  public componentWillMount(): void {
    const { sdkService } = this.context;

    this.addSubscriptions(
      sdkService
        .state
        .account$
        .subscribe(account => this.setState({
          account,
          url: account ? null : sdkService.createRequestAddAccountDeviceUrl(),
        })),
    );

    this.codeChanged = this.codeChanged.bind(this);
    this.codeSubmitted = this.codeSubmitted.bind(this);
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();
  }

  public render(): any {
    let result: React.ReactNode = null;

    const { url, account, code } = this.state;

    if (account && account.type !== sdkConstants.AccountTypes.Developer) {
      result = (
        <Box flexDirection="column">
          <Color blueBright={true}>
            Developer Program Invitation Code
          </Color>
          <TextInput
            value={code}
            onChange={this.codeChanged}
            onSubmit={this.codeSubmitted}
          />
        </Box>
      );
    } else if (url) {
      result = (
        <Box>
          <QrCode url={url} small={true} height={32} />
        </Box>
      );
    }

    return result;
  }

  private codeChanged(code: string): void {
    this.setState({
      code,
    });
  }

  private codeSubmitted(): void {
    const { code } = this.state;
    const { sdkService } = this.context;

    if (!code) {
      return;
    }

    this.setState({
      code: '',
    }, () => this.wrapAsync(async () => {
      await sdkService.becomeDeveloper(code);
    }));
  }
}
