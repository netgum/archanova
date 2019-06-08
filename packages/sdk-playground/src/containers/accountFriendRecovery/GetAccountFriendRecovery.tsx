import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (address: string) => `
const accountAddress = ${address ? `"${address}"` : 'null'};

sdk
  .getAccountFriendRecovery(accountAddress)
  .then(accountFriendRecovery => console.log('accountFriendRecovery', accountFriendRecovery))
  .catch(console.error);
`;

interface IState {
  address: string;
}

export class GetAccountFriendRecovery extends Screen<IState> {
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
          title="Get Account Friend Recovery"
          code={code(address)}
          enabled={address && enabled}
          run={this.run}
        >
          <InputText
            value={address}
            label="accountAddress"
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
      .wrapSync('sdk.getAccountFriendRecovery', async (console) => {
        console.log('accountFriendRecovery', await this.sdk.getAccountFriendRecovery(address));
      });
  }
}
