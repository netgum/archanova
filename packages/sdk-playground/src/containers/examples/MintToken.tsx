import { ContractNames, getContractAbi } from '@archanova/contracts';
import React from 'react';
import { Example, InputText, InputGasPriceStrategy, Screen } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (amount: number, gasPriceStrategy: string) => `
import { ContractNames, getContractAbi } from '@archanova/contracts';
${!gasPriceStrategy ? '' : 'import { sdkConstants } from \'@archanova/sdk\';'}

const abi = getContractAbi(ContractNames.ERC20Token);
const contract = sdk.createContractInstance(abi);
const amount = ${amount};
const data = contract.encodeMethodInput('mint', amount);
${!gasPriceStrategy ? '' : `const gasPriceStrategy = ${gasPriceStrategy};`}

sdk
  .getToken('ETK') // example token
  .then(({ address }) => sdk.estimateAccountTransaction(address, 0, ${mergeMethodArgs('data', gasPriceStrategy && 'gasPriceStrategy')}))
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
  gasPriceStrategy: any;
  estimated: any;
  amount: string;
  amountParsed: number;
}

export class MintToken extends Screen<IState> {
  public state = {
    gasPriceStrategy: null,
    estimated: null,
    amount: '0',
    amountParsed: 0,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.amountChanged = this.amountChanged.bind(this);
    this.gasPriceStrategyChanged = this.gasPriceStrategyChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { estimated, amount, amountParsed, gasPriceStrategy } = this.state;
    return (
      <div>
        <Example
          title="Estimate Mint Token"
          code={code1(amountParsed, InputGasPriceStrategy.selectedToText(gasPriceStrategy))}
          enabled={enabled}
          run={this.run1}
        >
          <InputText
            label="amount"
            type="number"
            decimal={true}
            value={amount}
            onChange={this.amountChanged}
          />
          <InputGasPriceStrategy
            selected={gasPriceStrategy}
            onChange={this.gasPriceStrategyChanged}
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

  private amountChanged(amount: string, amountParsed: number): void {
    this.setState({
      amount,
      amountParsed,
    });
  }

  private gasPriceStrategyChanged(gasPriceStrategy: any): void {
    this.setState({
      gasPriceStrategy,
    });
  }

  private run1(): void {
    const { amountParsed, gasPriceStrategy } = this.state;
    this
      .logger
      .wrapSync('estimateMintToken', async (console) => {
        const { address } = await this.sdk.getToken('ETK');
        const abi = getContractAbi(ContractNames.ERC20Token);
        const contract = this.sdk.createContractInstance(abi);
        const data = contract.encodeMethodInput('mint', amountParsed);
        const estimated = console.log('estimated', await this.sdk.estimateAccountTransaction(
          address,
          0,
          data,
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
