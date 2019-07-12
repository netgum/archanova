import React from 'react';
import { Example, Screen, InputText, InputTransactionSpeed, Button } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (hashes: string[], transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}

${hashes.length === 0 ? 'const hash = null;' : ''}
${hashes.length === 1 ? `const hash = '${hashes[0]}';` : ''}
${hashes.length > 1 ? `const hashes = ['${hashes.join('\', \'')}'];` : ''}
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .estimateWithdrawAccountPayment(${mergeMethodArgs(hashes.length < 2 && 'hash', hashes.length > 1 && 'hashes', transactionSpeed && 'transactionSpeed')})
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
  hashes: string[];
  hashesAmount: number;
}

export class WithdrawAccountPayment extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
    hashes: [''],
    hashesAmount: 1,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
    this.addHash = this.addHash.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { hashes, hashesAmount, estimated, transactionSpeed } = this.state;
    const normalizeHashes = hashes.filter(hash => !!hash);
    const hashKeys = Array(hashesAmount).fill(0).map((_, index) => `${index}`);

    return (
      <div>
        <Example
          title="Estimate Withdraw Account Payment"
          code={code1(normalizeHashes, InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={normalizeHashes.length && enabled}
          run={this.run1}
        >
          {hashKeys.map((key, index) => (
            <InputText
              key={key}
              value={hashes[index]}
              label={`hash[${index}]`}
              type="text"
              onChange={this.createHashChanged(index)}
            />
          ))}
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedChanged}
          />
          <div style={{ marginTop: 15 }}>
            <Button onClick={hashesAmount < 5 ? this.addHash : null}>Add Payment</Button>
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

  private createHashChanged(index: number): (hash: string) => void {
    return (hash) => {
      let { hashes } = this.state;
      hashes = [...hashes];
      hashes[index] = hash;
      this.setState({
        hashes,
      });
    };
  }

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private addHash(): void {
    let { hashes, hashesAmount } = this.state;
    hashes = [...hashes, ''];
    hashesAmount += 1;

    this.setState({
      hashes,
      hashesAmount,
    });
  }

  private run1(): void {
    const { hashes, transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateWithdrawAccountPayment', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateWithdrawAccountPayment(
          hashes.filter(hash => !!hash),
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
