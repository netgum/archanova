import { ISdkReduxState } from '@archanova/sdk';
import { weiToEth } from '@netgum/utils';
import React from 'react';
import { Box, Color } from 'ink';
import { connect } from 'react-redux';
import { QrCode } from './components';

export interface IStateProps {
  sdk: ISdkReduxState;
}

class App extends React.Component<IStateProps> {
  public render(): any {
    const {
      connected,
      initialized,
      authenticated,
      account,
      device,
    } = this.props.sdk;

    return (
      <Box flexDirection="column" justifyContent="flex-end" height="100%">
        <QrCode url={device ? device.address : '-'} small={true} />
        <Box>connected: <Color magenta={true}>{connected ? 'Y' : 'N'}</Color></Box>
        <Box>initialized: <Color magenta={true}>{initialized ? 'Y' : 'N'}</Color></Box>
        <Box>authenticated: <Color magenta={true}>{authenticated ? 'Y' : 'N'}</Color></Box>
        <Box>account: <Color magenta={true}>{account ? account.address : '-'}</Color></Box>
        <Box>accountBalance: <Color magenta={true}>{account && account.balance.real ? `${weiToEth(account.balance.real).toFixed(6)} ETH` : '-'}</Color></Box>
        <Box>device: <Color magenta={true}>{device ? device.address : '-'}</Color></Box>
      </Box>
    );
  }
}

export default connect<any, any, any, any>(
  ({ sdk }) => ({
    sdk,
  }),
)(App);
