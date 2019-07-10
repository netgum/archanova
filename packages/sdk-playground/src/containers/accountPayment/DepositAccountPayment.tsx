import React from 'react';
import { Example, Screen, InputText, InputTransactionSpeed } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (hash: string, transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}

const hash = ${hash ? `"${hash}"` : 'null'};
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .estimateDepositAccountPayment(${mergeMethodArgs('hash', transactionSpeed && 'transactionSpeed')})
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
  hash: string;
}

export class DepositAccountPayment extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
    hash: '',
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.hashChanged = this.hashChanged.bind(this);
    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { hash, estimated, transactionSpeed } = this.state;
    return (
      <div>
        <Example
          title="Estimate Deposit Account Payment"
          code={code1(hash, InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={hash && enabled}
          run={this.run1}
        >
          <InputText
            value={hash}
            label="hash"
            type="text"
            onChange={this.hashChanged}
          />
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedChanged}
          />
        </Example>
        <Example
          title="Submit Account Transaction"
          code={code2()}
          enabled={enabled && !!estimated}
          run={this.run2}
        />
      </div>
    );
  }

  private hashChanged(hash: string): void {
    this.setState({
      hash,
    });
  }

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run1(): void {
    const { hash, transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateDepositAccountPayment', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateDepositAccountPayment(
          hash,
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
