import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (friendAddress: string, friendSignature: string) => `
const friendAddress = ${friendAddress ? `"${friendAddress}"` : 'null'};
const friendSignature = ${friendSignature ? `"${friendSignature}"` : 'null'};

sdk
  .collectAccountFriendSignature(friendAddress, friendSignature)
  .then(accountFriendRecovery => console.log('accountFriendRecovery', accountFriendRecovery))
  .catch(console.error);
`;

interface IState {
  friendAddress: string;
  friendSignature: string;
}

export class CollectAccountFriendSignature extends Screen<IState> {
  public state = {
    friendAddress: '',
    friendSignature: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.friendAddressChanged = this.friendAddressChanged.bind(this);
    this.friendSignatureChanged = this.friendSignatureChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { friendAddress, friendSignature } = this.state;
    return (
      <div>
        <Example
          title="Collect Account Friend Signature"
          code={code(friendAddress, friendSignature)}
          enabled={friendAddress && friendSignature && enabled}
          run={this.run}
        >
          <InputText
            value={friendAddress}
            label="friendAddress"
            type="text"
            onChange={this.friendAddressChanged}
          />
          <InputText
            value={friendSignature}
            label="friendSignature"
            type="text"
            onChange={this.friendSignatureChanged}
          />
        </Example>
      </div>
    );
  }

  private friendAddressChanged(friendAddress: string): void {
    this.setState({
      friendAddress,
    });
  }

  private friendSignatureChanged(friendSignature: string): void {
    this.setState({
      friendSignature,
    });
  }

  private run(): void {
    const { friendAddress, friendSignature } = this.state;
    this
      .logger
      .wrapSync('sdk.collectAccountFriendSignature', async (console) => {
        console.log('accountFriendRecovery', await this.sdk.collectAccountFriendSignature(
          friendAddress,
          friendSignature,
        ));
      });
  }
}
