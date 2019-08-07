import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText, InputGasPriceStrategy } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (value: number, tokenAddress: string, gasPriceStrategy: string) => `
${!gasPriceStrategy ? '' : 'import { sdkConstants } from \'@archanova/sdk\';'}
${tokenAddress ? '' : 'import { ethToWei } from \'@netgum/utils\';'}

const value = ${tokenAddress ? value : `ethToWei(${value})`};
const tokenAddress = ${tokenAddress ? `'${tokenAddress}'` : 'null'};
${!gasPriceStrategy ? '' : `const gasPriceStrategy = ${gasPriceStrategy};`}

sdk
  .estimateWithdrawFromAccountVirtualBalance(${mergeMethodArgs('value', 'tokenAddress', gasPriceStrategy && 'gasPriceStrategy')})
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
  value: string;
  valueParsed: number;
  tokenAddress: string;
}

export class WithdrawFromAccountVirtualBalance extends Screen<IState> {
  public state = {
    gasPriceStrategy: null,
    estimated: null,
    value: '0',
    tokenAddress: '',
    valueParsed: 0,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.valueChanged = this.valueChanged.bind(this);
    this.tokenAddressChanged = this.tokenAddressChanged.bind(this);
    this.gasPriceStrategyChanged = this.gasPriceStrategyChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { estimated, value, tokenAddress, valueParsed, gasPriceStrategy } = this.state;
    return (
      <div>
        <Example
          title="Estimate Withdraw From Account Virtual Balance"
          code={code1(valueParsed, tokenAddress, InputGasPriceStrategy.selectedToText(gasPriceStrategy))}
          enabled={enabled}
          run={this.run1}
        >
          <InputText
            label="value"
            type="number"
            decimal={true}
            value={value}
            onChange={this.valueChanged}
          />
          <InputText
            label="tokenAddress"
            value={tokenAddress}
            onChange={this.tokenAddressChanged}
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

  private valueChanged(value: string, valueParsed: number): void {
    this.setState({
      value,
      valueParsed,
    });
  }

  private tokenAddressChanged(tokenAddress: string): void {
    this.setState({
      tokenAddress,
    });
  }

  private gasPriceStrategyChanged(gasPriceStrategy: any): void {
    this.setState({
      gasPriceStrategy,
    });
  }

  private run1(): void {
    const { valueParsed, tokenAddress, gasPriceStrategy } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateTopUpAccountVirtualBalance', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateWithdrawFromAccountVirtualBalance(
          tokenAddress ? valueParsed : ethToWei(valueParsed),
          tokenAddress,
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
