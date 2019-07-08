import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (address: string) => `
const deviceAddress = ${address ? `"${address}"` : 'null'};

sdk
  .removeAccountDevice(deviceAddress)
  .then(success => console.log('success', success))
  .catch(console.error);
`;

interface IState {
  address: string;
}

export class RemoveAccountDevice extends Screen<IState> {
  public state = {
    address: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.addressChanged = this.addressChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { address } = this.state;
    return (
      <div>
        <Example
          title="Remove Account Device"
          code={code(address)}
          enabled={address && enabled}
          run={this.run}
        >
          <InputText
            label="deviceAddress"
            value={address}
            onChange={this.addressChanged}
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

  private run(): void {
    const { address } = this.state;
    this
      .logger
      .wrapSync('sdk.removeAccountDevice', async (console) => {
        console.log('success', await this.sdk.removeAccountDevice(address));
      });
  }
}
