import React from 'react';
import { Example, Screen, InputText, InputTransactionSpeed } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (accountAddress: string, deviceAddress: string, transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}

const accountAddress = ${accountAddress ? `"${accountAddress}"` : 'null'};
const deviceAddress = ${deviceAddress ? `"${deviceAddress}"` : 'null'};
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .signAccountFriendRecovery(${mergeMethodArgs('accountAddress', 'deviceAddress', transactionSpeed && 'transactionSpeed')})
  .then(signature => console.log('signature', signature))
  .catch(console.error);
`;

interface IState {
  accountAddress: string;
  deviceAddress: string;
  transactionSpeed: any;
}

export class SignAccountFriendRecovery extends Screen<IState> {
  public state = {
    accountAddress: '',
    deviceAddress: '',
    transactionSpeed: null,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.accountAddressChanged = this.accountAddressChanged.bind(this);
    this.deviceAddressChanged = this.deviceAddressChanged.bind(this);
    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { accountAddress, deviceAddress, transactionSpeed } = this.state;
    return (
      <div>
        <Example
          title="Sign Account Friend Recovery"
          code={code(accountAddress, deviceAddress, InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={accountAddress && deviceAddress && enabled}
          run={this.run}
        >
          <InputText
            label="accountAddress"
            value={accountAddress}
            onChange={this.accountAddressChanged}
          />
          <InputText
            label="deviceAddress"
            value={deviceAddress}
            onChange={this.deviceAddressChanged}
          />
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedChanged}
          />
        </Example>
      </div>
    );
  }

  private accountAddressChanged(accountAddress: string) {
    this.setState({
      accountAddress,
    });
  }

  private deviceAddressChanged(deviceAddress: string): void {
    this.setState({
      deviceAddress,
    });
  }

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run(): void {
    const { accountAddress, deviceAddress, transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.signAccountFriendRecovery', async (console) => {
        console.log('signature', await this.sdk.signAccountFriendRecovery(
          accountAddress,
          deviceAddress,
          transactionSpeed,
        ));
      });
  }
}
