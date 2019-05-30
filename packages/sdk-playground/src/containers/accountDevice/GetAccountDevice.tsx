import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (accountAddress: string, deviceAddress: string) => `
const accountAddress = ${accountAddress ? `"${accountAddress}"` : 'null'};
const deviceAddress = ${deviceAddress ? `"${deviceAddress}"` : 'null'};

sdk
  .getAccountDevice(accountAddress, deviceAddress)
  .then(accountDevice => console.log('accountDevice', accountDevice));
  .catch(console.error);
`;

interface IState {
  accountAddress: string;
  deviceAddress: string;
}

export class GetAccountDevice extends Screen<IState> {
  public state = {
    accountAddress: '',
    deviceAddress: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.accountAddressChanged = this.accountAddressChanged.bind(this);
    this.deviceAddressChanged = this.deviceAddressChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { accountAddress, deviceAddress } = this.state;
    return (
      <div>
        <Example
          title="Get Account Device"
          code={code(accountAddress, deviceAddress)}
          enabled={accountAddress && deviceAddress && enabled}
          run={this.run}
        >
          <InputText
            value={accountAddress}
            label="accountAddress"
            type="text"
            onChange={this.accountAddressChanged}
          />
          <InputText
            value={deviceAddress}
            label="deviceAddress"
            type="text"
            onChange={this.deviceAddressChanged}
          />
        </Example>
      </div>
    );
  }

  private accountAddressChanged(accountAddress: string): void {
    this.setState({
      accountAddress,
    });
  }
  private deviceAddressChanged(deviceAddress: string): void {
    this.setState({
      deviceAddress,
    });
  }

  private run(): void {
    const { accountAddress, deviceAddress } = this.state;
    this
      .logger
      .wrapSync('sdk.getAccountDevice', async (console) => {
        console.log('accountDevice', await this.sdk.getAccountDevice(
          accountAddress,
          deviceAddress,
        ));
      });
  }
}
