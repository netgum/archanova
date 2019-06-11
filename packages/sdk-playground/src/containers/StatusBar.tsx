import React from 'react';
import { ISdkReduxState } from '@archanova/sdk';
import { connect } from 'react-redux';
import { HelpTrigger } from '../components';
import { formatBalance } from '../shared';
import styles from './StatusBar.module.scss';

interface IProps {
  sdk: ISdkReduxState;
}

class StatusBar extends React.Component<IProps> {
  public render() {
    const { sdk: { account, accountDevice, device, eth } } = this.props;

    let network = 'Unknown';

    if (eth && eth.networkId) {
      switch (eth.networkId) {
        case '3':
          network = 'Ropsten';
          break;

        case '4':
          network = 'Rinkeby';
          break;

        case '42':
          network = 'Kovan';
          break;

        default:
          network = 'Local';
      }
    }

    return (
      <div className={`${styles.content} ${!parseInt(process.env.REACT_APP_SECONDARY, 10) ? styles.invert : ''}`}>
        <HelpTrigger alias="statusBar.network">
          <div>Network</div>
          <div>{network}</div>
        </HelpTrigger>
        {!account || !accountDevice ? null : (
          <React.Fragment>
            <HelpTrigger alias="statusBar.accountAddress">
              <div>Account Address</div>
              <div>{account ? account.address : 'None'}</div>
            </HelpTrigger>
            <HelpTrigger alias="statusBar.accountState">
              <div>Account State</div>
              <div>{account ? account.state : 'None'}</div>
            </HelpTrigger>
            <HelpTrigger alias="statusBar.accountRealBalance">
              <div>Account Balance (real)</div>
              <div>
                {formatBalance(account && account.balance.real ? account.balance.real : null)}
              </div>
            </HelpTrigger>
            <HelpTrigger alias="statusBar.accountVirtualBalance">
              <div>Account Balance (virtual)</div>
              <div>
                {formatBalance(account && account.balance.virtual ? account.balance.virtual : null)}
              </div>
            </HelpTrigger>
            <HelpTrigger alias="statusBar.accountDeviceState">
              <div>Account Device State</div>
              <div>{accountDevice ? accountDevice.state : 'None'}</div>
            </HelpTrigger>
          </React.Fragment>
        )}
        <HelpTrigger alias="statusBar.deviceAddress">
          <div>Device Address</div>
          <div>{device ? device.address : 'None'}</div>
        </HelpTrigger>
      </div>
    );
  }
}

export default connect<IProps, {}, {}, IProps>(
  state => state,
)(StatusBar);
