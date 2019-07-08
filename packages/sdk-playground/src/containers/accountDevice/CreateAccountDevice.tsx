import React from 'react';
import { Example, Screen, InputText } from '../../components';
import { generateRandomAddress } from '../../shared';

const code = (address: string) => `
const deviceAddress = ${address ? `"${address}"` : 'null'};

sdk
  .createAccountDevice(deviceAddress)
  .then(accountDevice => console.log('accountDevice', accountDevice))
  .catch(console.error);
`;

interface IState {
  address: string;
}

export class CreateAccountDevice extends Screen<IState> {
  public state = {
    address: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.addressChanged = this.addressChanged.bind(this);
    this.generateAddress = this.generateAddress.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { address } = this.state;
    return (
      <div>
        <Example
          title="Create Account Device"
          code={code(address)}
          enabled={address && enabled}
          run={this.run}
        >
          <InputText
            label="deviceAddress"
            value={address}
            onChange={this.addressChanged}
            onRandomClick={this.generateAddress}
          />
        </Example>
      </div>
    );
  }

  private addressChanged(address: string): void {
    this.setState({
      address,
    });
  }

  private generateAddress(): void {
    this.setState({
      address: generateRandomAddress(),
    });
  }

  private run(): void {
    const { address } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccount', async (console) => {
        console.log('accountDevice', await this.sdk.createAccountDevice(address));
      });
  }
}
