import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (symbolOrAddress: string) => `
const symbolOrAddress = ${symbolOrAddress ? `"${symbolOrAddress}"` : 'null'};

sdk
  .getConnectedAccountVirtualPendingBalance(symbolOrAddress)
  .then(accountVirtualPendingBalance => console.log('accountVirtualPendingBalance', accountVirtualPendingBalance))
  .catch(console.error);
`;

interface IState {
  symbolOrAddress: string;
}

export class GetConnectedAccountVirtualPendingBalance extends Screen<IState> {
  public state = {
    symbolOrAddress: 'ETK',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.symbolOrAddressChanged = this.symbolOrAddressChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { symbolOrAddress } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Virtual Pending Balance"
          code={code(symbolOrAddress)}
          enabled={symbolOrAddress && enabled}
          run={this.run}
        >
          <InputText
            value={symbolOrAddress}
            label="symbolOrAddress"
            type="text"
            onChange={this.symbolOrAddressChanged}
          />
        </Example>
      </div>
    );
  }

  private symbolOrAddressChanged(symbolOrAddress: string): void {
    this.setState({
      symbolOrAddress,
    });
  }

  private run(): void {
    const { symbolOrAddress } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountVirtualPendingBalance', async (console) => {
        console.log('accountVirtualPendingBalance', await this.sdk.getConnectedAccountVirtualPendingBalance(symbolOrAddress));
      });
  }
}
