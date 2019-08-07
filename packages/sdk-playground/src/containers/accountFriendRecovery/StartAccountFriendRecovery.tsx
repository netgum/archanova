import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (accountAddress: string) => `
const accountAddress = ${accountAddress ? `"${accountAddress}"` : 'null'};

sdk
  .startAccountFriendRecovery(accountAddress)
  .then(accountFriendRecovery => console.log('accountFriendRecovery', accountFriendRecovery))
  .catch(console.error);
`;

interface IState {
  accountAddress: string;
}

export class StartAccountFriendRecovery extends Screen<IState> {
  public state = {
    accountAddress: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.accountAddressChanged = this.accountAddressChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { accountAddress } = this.state;
    return (
      <div>
        <Example
          title="Start Account Friend Recovery"
          code={code(accountAddress)}
          enabled={accountAddress && enabled}
          run={this.run}
        >
          <InputText
            label="accountAddress"
            value={accountAddress}
            onChange={this.accountAddressChanged}
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

  private run(): void {
    const { accountAddress } = this.state;
    this
      .logger
      .wrapSync('sdk.startAccountFriendRecovery', async (console) => {
        console.log('accountFriendRecovery', await this.sdk.startAccountFriendRecovery(accountAddress));
      });
  }
}
