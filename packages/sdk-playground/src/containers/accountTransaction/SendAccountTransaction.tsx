import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText, InputTransactionSpeed, Button } from '../../components';
import { generateRandomAddress, mergeMethodArgs } from '../../shared';

const code1 = (recipient: string[], value: number[], data: string[], transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}
import { ethToWei } from '@netgum/utils';

const recipient = [
${recipient.map(item => (
  `  ${item ? `'${item}'` : 'null'}`
)).join(', \n')},
];
const value = [
${value.map(item => `  ethToWei(${item})`).join(', \n')},
];
const data = [
${data.map(item => (
  `  ${item ? `'${item}'` : 'null'}`
)).join(', \n')},
];
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .estimateAccountTransaction(
    ${mergeMethodArgs(
  'recipient[0]', 'value[0]', 'data[0]',
  ...(recipient[1] ? [`${'\n'}    recipient[1]`, 'value[1]', 'data[1]'] : []),
  ...(recipient[2] ? [`${'\n'}    recipient[2]`, 'value[2]', 'data[2]'] : []),
  ...(recipient[3] ? [`${'\n'}    recipient[3]`, 'value[3]', 'data[3]'] : []),
  ...(recipient[4] ? [`${'\n'}    recipient[4]`, 'value[4]', 'data[4]'] : []),
  transactionSpeed && `${'\n'}    transactionSpeed`,
)}${','}
  )
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
  recipient: string[];
  value: string[];
  valueParsed: number[];
  data: string[];
  transactionAmount: number;
}

export class SendAccountTransaction extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
    recipient: [''],
    value: ['0'],
    valueParsed: [0],
    data: [''],
    transactionAmount: 1,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
    this.addTransaction = this.addTransaction.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { recipient, value, valueParsed, data, estimated, transactionSpeed, transactionAmount } = this.state;

    const normalizedRecipient = this.normalizeList(recipient);
    const transactionKeys = Array(transactionAmount).fill(0).map((_, index) => `${index}`);

    return (
      <div>
        <Example
          title="Estimate Account Transaction"
          code={code1(
            normalizedRecipient,
            this.normalizeList(valueParsed),
            this.normalizeList(data),
            InputTransactionSpeed.selectedToText(transactionSpeed),
          )}
          enabled={normalizedRecipient[0] && enabled}
          run={this.run1}
        >
          {transactionKeys.map((key, index) => (
            <React.Fragment key={key}>
              <InputText
                value={recipient[index]}
                label={`recipient[${key}] `}
                onChange={this.createRecipientChanged(index)}
                onRandomClick={this.createGenerateRecipient(index)}
              />
              <InputText
                value={value[index]}
                label={`value[${key}]`}
                type="number"
                decimal={true}
                onChange={this.createValueChanged(index)}
              />
              <InputText
                value={data[index]}
                label={`data[${key}]`}
                onChange={this.createDataChanged(index)}
              />
            </React.Fragment>
          ))}
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedChanged}
          />
          <div style={{ marginTop: 15 }}>
            <Button onClick={transactionAmount < 5 ? this.addTransaction : null}>Add Transaction</Button>
          </div>
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

  private normalizeList<T = any>(list: T[]): T[] {
    const result: T[] = [];
    const { recipient, transactionAmount } = this.state;

    for (let i = 0; i < transactionAmount; i += 1) {
      if (recipient[i]) {
        result.push(list[i]);
      }
    }

    if (!result.length) {
      result.push(list[0]);
    }

    return result;
  }

  private createRecipientChanged(index: number): (newRecipient: string) => void {
    return (newRecipient) => {
      let { recipient } = this.state;
      recipient = [...recipient];
      recipient[index] = newRecipient;
      this.setState({
        recipient,
      });
    };
  }

  private createGenerateRecipient(index: number): () => void {
    return () => {
      let { recipient } = this.state;
      recipient = [...recipient];
      recipient[index] = generateRandomAddress();
      this.setState({
        recipient,
      });
    };
  }

  private createValueChanged(index: number): (newValue: string, newValueParsed: number) => void {
    return (newValue, newValueParsed) => {
      let { value, valueParsed } = this.state;
      value = [...value];
      value[index] = newValue;
      valueParsed = [...valueParsed];
      valueParsed[index] = newValueParsed;

      this.setState({
        value,
        valueParsed,
      });
    };
  }

  private createDataChanged(index: number): (newData: string) => void {
    return (newData) => {
      let { data } = this.state;
      data = [...data];
      data[index] = newData;
      this.setState({
        data,
      });
    };
  }

  private addTransaction(): void {
    let { transactionAmount, recipient, value, valueParsed, data } = this.state;
    recipient = [...recipient, ''];
    value = [...value, '0'];
    valueParsed = [...valueParsed, 0];
    data = [...data, ''];
    transactionAmount += 1;

    this.setState({
      transactionAmount,
      recipient,
      value,
      valueParsed,
      data,
    });
  }

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run1(): void {
    const { recipient, valueParsed, data, transactionSpeed, transactionAmount } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateAccountTransaction', async (console) => {
        const args: any[] = [];

        for (let i = 0; i < transactionAmount; i += 1) {
          if (recipient[i]) {
            args.push(recipient[i]);
            args.push(ethToWei(valueParsed[i]));
            args.push(data[i]);
          }
        }

        args.push(transactionSpeed);

        const estimated = console.log('estimated', await (this.sdk.estimateAccountTransaction as any)(...args));

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
