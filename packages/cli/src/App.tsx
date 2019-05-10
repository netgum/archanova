import { ISdkReduxState } from '@archanova/sdk';
import React from 'react';
import { Box, Color } from 'ink';
import { connect } from 'react-redux';
import Spinner from 'ink-spinner';
import { QrCode } from './components';
import Link from 'ink-link';
import Box2 from 'ink-box';
import { Tab, Tabs } from 'ink-tab';

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

    const onChange = () => null;

    return (
      <Box flexDirection="column" justifyContent="flex-end" height="100%">
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
          {' Please wait ...'}
        </Box>
        <Link url="https://google.com">
          Link <Color cyan>link</Color>
        </Link>
        <Box2 borderStyle="round" borderColor="cyan" padding={1}>
          I Love <Color magenta>Unicorns</Color>
        </Box2>
        <Tabs onChange={onChange}>
          <Tab name="foo">Foo</Tab>
          <Tab name="bar">Bar</Tab>
          <Tab name="baz">Baz</Tab>
        </Tabs>
      </Box>
    );
  }
}

export default connect<any, any, any, any>(
  ({ sdk }) => ({
    sdk,
  }),
)(App);
