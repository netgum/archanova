import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText, InputTransactionSpeed } from '../../components';
import { generateRandomAddress, mergeMethodArgs } from '../../shared';

const code1 = (recipient: string, value: number, data: string, transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}
import { ethToWei } from '@netgum/utils';

const recipient = ${recipient ? `"${recipient}"` : 'null'};
const value = ethToWei(${value});
const data = ${data ? `"${data}"` : 'null'};
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .estimateAccountTransaction(${mergeMethodArgs('recipient', 'value', 'data', transactionSpeed && 'transactionSpeed')})
  .then(estimated => console.log('estimated', estimated));
  .catch(console.error);
`;

const code2 = () => `
const estimated; // estimated transaction

sdk
  .submitAccountTransaction(estimated)
  .then(hash => console.log('hash', hash));
  .catch(console.error);
`;

interface IState {
  transactionSpeed: any;
  estimated: any;
  recipient: string;
  value: string;
  valueParsed: number;
  data: string;
}

export class SendAccountTransaction extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
    recipient: '',
    value: '0',
    valueParsed: 0,
    data: '',
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.recipientChanged = this.recipientChanged.bind(this);
    this.valueChanged = this.valueChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
    this.generateRecipient = this.generateRecipient.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { recipient, value, valueParsed, data, estimated, transactionSpeed } = this.state;
    return (
      <div>
        <Example
          title="Estimate Account Transaction"
          code={code1(recipient, valueParsed, data, InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={recipient && enabled}
          run={this.run1}
        >
          <InputText
            value={recipient}
            label="recipient"
            onChange={this.recipientChanged}
            onRandomClick={this.generateRecipient}
          />
          <InputText
            value={value}
            label="value"
            type="number"
            decimal={true}
            onChange={this.valueChanged}
          />
          <InputText
            value={data}
            label="data"
            onChange={this.dataChanged}
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

  private recipientChanged(recipient: string): void {
    this.setState({
      recipient,
    });
  }

  private generateRecipient(): void {
    this.setState({
      recipient: generateRandomAddress(),
    });
  }

  private valueChanged(value: string, valueParsed: number): void {
    this.setState({
      value,
      valueParsed,
    });
  }

  private dataChanged(data: string): void {
    this.setState({
      data,
    });
  }

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run1(): void {
    const { recipient, valueParsed, data, transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateAccountTransaction', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateAccountTransaction(
          recipient,
          ethToWei(valueParsed),
          data,
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
