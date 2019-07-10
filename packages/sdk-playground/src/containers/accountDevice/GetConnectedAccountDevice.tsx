import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (address: string) => `
const address = ${address ? `"${address}"` : 'null'};

sdk
  .getConnectedAccountDevice(address)
  .then(accountDevice => console.log('accountDevice', accountDevice))
  .catch(console.error);
`;

interface IState {
  address: string;
}

export class GetConnectedAccountDevice extends Screen<IState> {
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
          title="Get Connected Account Device"
          code={code(address)}
          enabled={address && enabled}
          run={this.run}
        >
          <InputText
            value={address}
            label="address"
            type="text"
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
      .wrapSync('sdk.getConnectedAccountDevice', async (console) => {
        console.log('accountDevice', await this.sdk.getConnectedAccountDevice(address));
      });
  }
}
