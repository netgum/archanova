import React from 'react';
import { Example, Screen, InputSelect, InputText } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (page: number) => `
${page ? `const page = ${page};` : ''}

sdk
  .getConnectedAccounts(${mergeMethodArgs(page && 'page')})
  .then(accounts => console.log('accounts', accounts));
  .catch(console.error);
`;

const code2 = (accountAddress: string) => `
const accountAddress = ${accountAddress ? `"${accountAddress}"` : 'null'};

sdk
  .connectAccount(accountAddress)
  .then(account => console.log('account', account));
  .catch(console.error);
`;

interface IState {
  page: string;
  pageParsed: number;
  addresses: string[];
  address: string;
}

export class ConnectAccount extends Screen<IState> {
  public state = {
    page: '0',
    pageParsed: 0,
    addresses: [],
    address: null,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.pageChanged = this.pageChanged.bind(this);
    this.addressChanged = this.addressChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { page, pageParsed, address, addresses } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Accounts"
          code={code1(pageParsed)}
          enabled={enabled}
          run={this.run1}
        >
          <InputText
            label="page"
            type="number"
            value={page}
            onChange={this.pageChanged}
          />
        </Example>

        <Example
          title="Connect Account"
          code={code2(address)}
          enabled={address && enabled}
          run={this.run2}
        >
          {!address ? null : (
            <InputSelect
              label="accountAddress"
              selected={address}
              values={addresses}
              onChange={this.addressChanged}
            />
          )}
        </Example>
      </div>
    );
  }

  private addressChanged(address: string) {
    this.setState({
      address,
    });
  }

  private pageChanged(page: string, pageParsed: number) {
    this.setState({
      page,
      pageParsed,
    });
  }

  private run1(): void {
    const { pageParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccounts', async (console) => {
        const { items } = console.log('accounts', await this.sdk.getConnectedAccounts(pageParsed));

        const addresses = items.map(({ address }) => address);

        this.setState({
          addresses,
          address: addresses[0] || null,
        });
      });
  }

  private run2(): void {
    const { address } = this.state;
    this
      .logger
      .wrapSync('sdk.connectAccount', async (console) => {
        console.log('account', await this.sdk.connectAccount(address));
      });
  }
}
