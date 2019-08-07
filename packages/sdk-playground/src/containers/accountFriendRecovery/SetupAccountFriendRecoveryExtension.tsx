import React from 'react';
import { Example, Screen, InputText, InputGasPriceStrategy } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (requiredFriendsParsed: number, friendAddressesParsed: string[], gasPriceStrategy: string) => `
${!gasPriceStrategy ? '' : 'import { sdkConstants } from \'@archanova/sdk\';'}

const requiredFriends = ${requiredFriendsParsed};
const friendAddresses = ${!friendAddressesParsed.length ? '[]' : `['${friendAddressesParsed.join('\', \'')}']`};
${!gasPriceStrategy ? '' : `const gasPriceStrategy = ${gasPriceStrategy};`}

sdk
  .estimateSetupAccountFriendRecoveryExtension(${mergeMethodArgs('requiredFriends', 'friendAddresses', gasPriceStrategy && 'gasPriceStrategy')})
  .then(estimated => console.log('estimated', estimated))
  .catch(console.error);
`;

const code2 = () => `
const estimated; // estimated transaction

sdk
  .submitAccountTransaction(estimated)
  .then(hash => console.log('hash', hash))
  .catch(console.error);
`;

interface IState {
  requiredFriends: string;
  requiredFriendsParsed: number;
  friendAddresses: string;
  friendAddressesParsed: string[];
  gasPriceStrategy: any;
  estimated: any;
}

export class SetupAccountFriendRecoveryExtension extends Screen<IState> {
  public state = {
    requiredFriends: '0',
    requiredFriendsParsed: 0,
    friendAddresses: '',
    friendAddressesParsed: [],
    gasPriceStrategy: null,
    estimated: null,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.requiredFriendsChanged = this.requiredFriendsChanged.bind(this);
    this.friendAddressesChanged = this.friendAddressesChanged.bind(this);
    this.gasPriceStrategyChanged = this.gasPriceStrategyChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { requiredFriends, requiredFriendsParsed, friendAddresses, friendAddressesParsed, gasPriceStrategy, estimated } = this.state;

    return (
      <div>
        <Example
          title="Estimate Setup Account Friend Recovery Extension"
          code={code1(requiredFriendsParsed, friendAddressesParsed, InputGasPriceStrategy.selectedToText(gasPriceStrategy))}
          enabled={requiredFriends && friendAddressesParsed.length && enabled}
          run={this.run1}
        >
          <InputText
            label="requiredFriends"
            value={requiredFriends}
            type="number"
            onChange={this.requiredFriendsChanged}
          />
          <InputText
            label="friendAddresses"
            value={friendAddresses}
            onChange={this.friendAddressesChanged}
          />
          <InputGasPriceStrategy
            selected={gasPriceStrategy}
            onChange={this.gasPriceStrategyChanged}
          />
        </Example>
        <Example
          title="Submit Account Transaction"
          code={code2()}
          enabled={estimated && enabled}
          run={this.run2}
        />
      </div>
    );
  }

  private requiredFriendsChanged(requiredFriends: string, requiredFriendsParsed: number) {
    this.setState({
      requiredFriends,
      requiredFriendsParsed,
    });
  }

  private friendAddressesChanged(friendAddresses: string): void {
    this.setState({
      friendAddresses,
      friendAddressesParsed: friendAddresses.split(',').map(value => value.trim()).filter(value => !!value),
    });
  }

  private gasPriceStrategyChanged(gasPriceStrategy: any): void {
    this.setState({
      gasPriceStrategy,
    });
  }

  private run1(): void {
    const { requiredFriendsParsed, friendAddressesParsed, gasPriceStrategy } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateSetupAccountFriendRecoveryExtension', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateSetupAccountFriendRecoveryExtension(
          requiredFriendsParsed,
          friendAddressesParsed,
          gasPriceStrategy,
        ));

        this.setState({
          estimated,
        });
      });
  }

  private run2(): void {
    const { estimated } = this.state;
    this
      .logger
      .wrapSync('sdk.submitAccountTransaction', async (console) => {
        console.log('hash', await this.sdk.submitAccountTransaction(estimated));

        this.setState({
          estimated: null,
        });
      });
  }
}
