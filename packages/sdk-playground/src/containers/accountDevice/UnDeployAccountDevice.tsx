import React from 'react';
import { Example, Screen, InputText, InputGasPriceStrategy } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (address: string, gasPriceStrategy: string) => `
${!gasPriceStrategy ? '' : 'import { sdkConstants } from \'@archanova/sdk\';'}

const deviceAddress = ${address ? `"${address}"` : 'null'};
${!gasPriceStrategy ? '' : `const gasPriceStrategy = ${gasPriceStrategy};`}

sdk
  .estimateAccountDeviceUnDeployment(${mergeMethodArgs('deviceAddress', gasPriceStrategy && 'gasPriceStrategy')})
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
  address: string;
  gasPriceStrategy: any;
  estimated: any;
}

export class UnDeployAccountDevice extends Screen<IState> {
  public state = {
    gasPriceStrategy: null,
    estimated: null,
    address: '',
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.addressChanged = this.addressChanged.bind(this);
    this.gasPriceStrategyUpdated = this.gasPriceStrategyUpdated.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { address, gasPriceStrategy, estimated } = this.state;
    return (
      <div>
        <Example
          title="Estimate Account Device UnDeployment"
          code={code1(address, InputGasPriceStrategy.selectedToText(gasPriceStrategy))}
          enabled={address && enabled}
          run={this.run1}
        >
          <InputText
            label="deviceAddress"
            value={address}
            onChange={this.addressChanged}
          />
          <InputGasPriceStrategy
            selected={gasPriceStrategy}
            onChange={this.gasPriceStrategyUpdated}
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

  private addressChanged(address: string): void {
    this.setState({
      address,
    });
  }

  private gasPriceStrategyUpdated(gasPriceStrategy: any): void {
    this.setState({
      gasPriceStrategy,
    });
  }

  private run1(): void {
    const { address, gasPriceStrategy } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateAccountDeviceUnDeployment', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateAccountDeviceUnDeployment(
          address,
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
