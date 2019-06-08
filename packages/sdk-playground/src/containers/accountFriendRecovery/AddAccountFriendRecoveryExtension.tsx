import React from 'react';
import { Example, Screen, InputTransactionSpeed } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}

sdk
  .estimateAddAccountFriendRecoveryExtension(${mergeMethodArgs(transactionSpeed && 'transactionSpeed')})
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
  transactionSpeed: any;
  estimated: any;
}

export class AddAccountFriendRecoveryExtension extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { transactionSpeed, estimated } = this.state;
    return (
      <div>
        <Example
          title="Estimate Add Account Friend Recovery Extension"
          code={code1(InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={enabled}
          run={this.run1}
        >
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedChanged}
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

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run1(): void {
    const { transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateAddAccountFriendRecoveryExtension', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateAddAccountFriendRecoveryExtension(
          transactionSpeed,
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
