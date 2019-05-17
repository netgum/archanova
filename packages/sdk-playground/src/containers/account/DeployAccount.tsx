import React from 'react';
import { Example, Screen, InputTransactionSpeed } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (transactionSpeed: string) => `
${!transactionSpeed ? '' : `
import { sdkModules } from '@archanova/sdk';

const transactionSpeed = ${transactionSpeed};
`}
sdk
  .estimateAccountDeployment(${mergeMethodArgs(transactionSpeed && 'transactionSpeed')})
  .then(estimated => console.log('estimated', estimated));
  .catch(console.error);
`;
const code2 = (transactionSpeed: string) => `
${!transactionSpeed ? '' : `
import { sdkModules } from '@archanova/sdk';

const transactionSpeed = ${transactionSpeed};
`}
sdk
  .deployAccount(${mergeMethodArgs(transactionSpeed && 'transactionSpeed')})
  .then(hash => console.log('hash', hash));
  .catch(console.error);
`;

interface IState {
  transactionSpeed: any;
  estimated: boolean;
}

export class DeployAccount extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.transactionSpeedUpdated = this.transactionSpeedUpdated.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { estimated, transactionSpeed } = this.state;
    return (
      <div>
        <Example
          title="Estimate Account Deployment"
          code={code1(InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={enabled}
          run={this.run1}
        >
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedUpdated}
          />
        </Example>
        <Example
          title="Deploy Account"
          code={code2(InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={enabled && !!estimated}
          run={this.run2}
        >
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedUpdated}
          />
        </Example>
      </div>
    );
  }

  private transactionSpeedUpdated(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run1(): void {
    const { transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateAccountDeployment', async (console) => {
        console.log('estimated', await this.sdk.estimateAccountDeployment(transactionSpeed));

        this.setState({
          estimated: true,
        });
      });
  }

  private run2(): void {
    const { transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.deployAccount', async (console) => {
        console.log('hash', await this.sdk.deployAccount(transactionSpeed));

        this.setState({
          estimated: false,
        });
      });
  }
}
