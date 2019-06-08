import React from 'react';
import { Example, Screen, InputText, InputTransactionSpeed } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (accountAddress: string, transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}

const accountAddress = ${accountAddress ? `"${accountAddress}"` : 'null'};
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .startAccountFriendRecovery(${mergeMethodArgs('accountAddress', transactionSpeed && 'transactionSpeed')})
  .then(accountFriendRecovery => console.log('accountFriendRecovery', accountFriendRecovery))
  .catch(console.error);
`;


interface IState {
  accountAddress: string;
  transactionSpeed: any;
}

export class StartAccountFriendRecovery extends Screen<IState> {
  public state = {
    accountAddress: '',
    transactionSpeed: null,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.accountAddressChanged = this.accountAddressChanged.bind(this);
    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { accountAddress, transactionSpeed } = this.state;
    return (
      <div>
        <Example
          title="Start Account Friend Recovery"
          code={code(accountAddress, InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={accountAddress && enabled}
          run={this.run}
        >
          <InputText
            label="accountAddress"
            value={accountAddress}
            onChange={this.accountAddressChanged}
          />
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedChanged}
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

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run(): void {
    const { accountAddress, transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.startAccountFriendRecovery', async (console) => {
        console.log('accountFriendRecovery', await this.sdk.startAccountFriendRecovery(
          accountAddress,
          transactionSpeed,
        ));
      });
  }
}
