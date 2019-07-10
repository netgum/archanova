import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (ensName: string, address: string) => `
const options = {
  ${address ? `address: "${address}"` : `ensName: ${ensName ? `"${ensName}"` : 'null'}`},
};

sdk
  .searchAccount(options)
  .then(account => console.log('account', account))
  .catch(console.error);
`;

interface IState {
  ensName: string;
  address: string;
}

export class SearchAccount extends Screen<IState> {
  public state = {
    ensName: '',
    address: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.ensNameChanged = this.ensNameChanged.bind(this);
    this.addressChanged = this.addressChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { ensName, address } = this.state;
    return (
      <div>
        <Example
          title="Search Account"
          code={code(ensName, address)}
          enabled={(ensName || address) && enabled}
          run={this.run}
        >
          <InputText
            label="ensName"
            value={ensName}
            onChange={this.ensNameChanged}
          />
          <InputText
            label="address"
            value={address}
            onChange={this.addressChanged}
          />
        </Example>
      </div>
    );
  }

  private ensNameChanged(ensName: string): void {
    this.setState({
      ensName,
    });
  }

  private addressChanged(address: string): void {
    this.setState({
      address,
    });
  }

  private run(): void {
    const { ensName, address } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccount', async (console) => {
        console.log('account', await this.sdk.searchAccount({
          ensName,
          address,
        }));
      });
  }
}
