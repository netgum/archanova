import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (symbolOrAddress: string) => `
const symbolOrAddress = ${symbolOrAddress ? `"${symbolOrAddress}"` : 'null'};

sdk
  .getToken(symbolOrAddress)
  .then(token => console.log('token', token));
  .catch(console.error);
`;

interface IState {
  symbolOrAddress: string;
}

export class GetToken extends Screen<IState> {
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
          title="Get Token"
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
      .wrapSync('sdk.getToken', async (console) => {
        console.log('token', await this.sdk.getToken(symbolOrAddress));
      });
  }
}
