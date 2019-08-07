import React from 'react';
import { anyToBN } from '@netgum/utils';
import { Example, Screen, InputText } from '../../components';

const code = (accountAddress: string, deviceAddress: string, gasPrice: string) => `
import { anyToBN } from '@netgum/utils';

const accountAddress = ${accountAddress ? `"${accountAddress}"` : 'null'};
const deviceAddress = ${deviceAddress ? `"${deviceAddress}"` : 'null'};
const gasPrice = anyToBN(${gasPrice ? `"${gasPrice}"` : 'null'});

sdk
  .signAccountFriendRecovery(accountAddress, deviceAddress, gasPrice)
  .then(signature => console.log('signature', signature))
  .catch(console.error);
`;

interface IState {
  accountAddress: string;
  deviceAddress: string;
  gasPrice: string;
}

export class SignAccountFriendRecovery extends Screen<IState> {
  public state = {
    accountAddress: '',
    deviceAddress: '',
    gasPrice: null,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.accountAddressChanged = this.accountAddressChanged.bind(this);
    this.deviceAddressChanged = this.deviceAddressChanged.bind(this);
    this.gasPriceChanged = this.gasPriceChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { accountAddress, deviceAddress, gasPrice } = this.state;
    return (
      <div>
        <Example
          title="Sign Account Friend Recovery"
          code={code(accountAddress, deviceAddress, gasPrice)}
          enabled={accountAddress && deviceAddress && enabled}
          run={this.run}
        >
          <InputText
            label="accountAddress"
            value={accountAddress}
            onChange={this.accountAddressChanged}
          />
          <InputText
            label="deviceAddress"
            value={deviceAddress}
            onChange={this.deviceAddressChanged}
          />
          <InputText
            label="gasPrice"
            value={gasPrice}
            onChange={this.gasPriceChanged}
          />
        </Example>
      </div>
    );
  }

  private accountAddressChanged(accountAddress: string) {
    this.setState({
      accountAddress,
    });
  }

  private deviceAddressChanged(deviceAddress: string): void {
    this.setState({
      deviceAddress,
    });
  }

  private gasPriceChanged(gasPrice: any): void {
    this.setState({
      gasPrice,
    });
  }

  private run(): void {
    const { accountAddress, deviceAddress, gasPrice } = this.state;
    this
      .logger
      .wrapSync('sdk.signAccountFriendRecovery', async (console) => {
        console.log('signature', await this.sdk.signAccountFriendRecovery(
          accountAddress,
          deviceAddress,
          anyToBN(gasPrice),
        ));
      });
  }
}
