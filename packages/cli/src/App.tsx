import { ISdkReduxState } from '@archanova/sdk';
import React from 'react';
import { Box, Color } from 'ink';
import { connect } from 'react-redux';
import Spinner from 'ink-spinner';
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
      <Box flexDirection="column">
        <QrCode url={device ? device.address : '-'} small={true} />
        <Box>connected: {connected ? 'Y' : 'N'}</Box>
        <Box>initialized: {initialized ? 'Y' : 'N'}</Box>
        <Box>authenticated: {authenticated ? 'Y' : 'N'}</Box>
        <Box>account: {account ? account.address : '-'}</Box>
        <Box>device: {device ? device.address : '-'}</Box>
        <Box>
          <Color green={true}>
            <Spinner type="dots" />
          </Color>
        </Box>
      </Box>
    );
  }
}

export default connect<any, any, any, any>(
  ({ sdk }) => ({
    sdk,
  }),
)(App);
