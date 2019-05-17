import React from 'react';
import { sdkInterfaces } from '@archanova/sdk';
import { Box, Color } from 'ink';

interface IProps {
  account: sdkInterfaces.IAccount;
  appAlias: string;
  url: string;
}

export class App extends React.Component<IProps> {

  public render(): any {
    const { account, url, appAlias } = this.props;
    return (
      <Box flexDirection="column" padding={2}>
        developer:
        <Color magenta={true}>{account.address}</Color>
        alias:
        <Color magenta={true}>{appAlias}</Color>
        callback url:
        <Color magenta={true}>{url}</Color>
      </Box>
    );
  }
}
