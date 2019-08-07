import React from 'react';
import { Example, Screen, InputGasPriceStrategy } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (gasPriceStrategy: string) => `
${!gasPriceStrategy ? '' : `
import { sdkConstants } from '@archanova/sdk';

const gasPriceStrategy = ${gasPriceStrategy};
`}
sdk
  .estimateAccountDeployment(${mergeMethodArgs(gasPriceStrategy && 'gasPriceStrategy')})
  .then(estimated => console.log('estimated', estimated))
  .catch(console.error);
`;
const code2 = () => `
const estimated; // estimated deployment

sdk
  .deployAccount(estimated)
  .then(hash => console.log('hash', hash))
  .catch(console.error);
`;

interface IState {
  gasPriceStrategy: any;
  estimated: any;
}

export class DeployAccount extends Screen<IState> {
  public state = {
    gasPriceStrategy: null,
    estimated: null,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.gasPriceStrategyUpdated = this.gasPriceStrategyUpdated.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { estimated, gasPriceStrategy } = this.state;
    return (
      <div>
        <Example
          title="Estimate Account Deployment"
          code={code1(InputGasPriceStrategy.selectedToText(gasPriceStrategy))}
          enabled={enabled}
          run={this.run1}
        >
          <InputGasPriceStrategy
            selected={gasPriceStrategy}
            onChange={this.gasPriceStrategyUpdated}
          />
        </Example>
        <Example
          title="Deploy Account"
          code={code2()}
          enabled={enabled && !!estimated}
          run={this.run2}
        />
      </div>
    );
  }

  private gasPriceStrategyUpdated(gasPriceStrategy: any): void {
    this.setState({
      gasPriceStrategy,
    });
  }

  private run1(): void {
    const { gasPriceStrategy } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateAccountDeployment', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateAccountDeployment(gasPriceStrategy));

        this.setState({
          estimated,
        });
      });
  }

  private run2(): void {
    const { estimated } = this.state;
    this
      .logger
      .wrapSync('sdk.deployAccount', async (console) => {
        console.log('hash', await this.sdk.deployAccount(estimated));

        this.setState({
          estimated: null,
        });
      });
  }
}
