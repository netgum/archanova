import React from 'react';
import { ISdkReduxState } from '@archanova/sdk';
import { connect } from 'react-redux';
import { formatBalance, getLocationPort } from '../shared';
import styles from './Header.module.scss';

interface IProps {
  sdk: ISdkReduxState;
}

class Header extends React.Component<IProps> {
  public render() {
    const { sdk: { account, accountDevice, device } } = this.props;
    return (
      <div className={`${styles.content} ${getLocationPort() !== 5200 ? styles.invert : ''}`}>
        <div>
          <div>Instance Port</div>
          <div>{getLocationPort()}</div>
        </div>
        {!account || !accountDevice ? null : (
          <React.Fragment>
            <div>
              <div>Account Address</div>
              <div>{account ? account.address : 'None'}</div>
            </div>
            <div>
              <div>Account State</div>
              <div>{account ? account.state : 'None'}</div>
            </div>
            <div>
              <div>Account Balance (real)</div>
              <div>
                {formatBalance(account && account.balance.real ? account.balance.real : null)}
              </div>
            </div>
            <div>
              <div>Account Balance (virtual)</div>
              <div>
                {formatBalance(account && account.balance.virtual ? account.balance.virtual : null)}
              </div>
            </div>
            <div>
              <div>Account Device State</div>
              <div>{accountDevice ? accountDevice.state : 'None'}</div>
            </div>
          </React.Fragment>
        )}
        <div>
          <div>Device Address</div>
          <div>{device ? device.address : 'None'}</div>
        </div>
      </div>
    );
  }
}

export default connect<IProps, {}, {}, IProps>(
  state => state,
)(Header);
