import React from 'react';
import { Example, Screen, InputText, InputTransactionSpeed } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (address: string, transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}

const deviceAddress = ${address ? `"${address}"` : 'null'};
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .estimateAccountDeviceDeployment(${mergeMethodArgs('deviceAddress', transactionSpeed && 'transactionSpeed')})
  .then(success => console.log('success', success))
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
  address: string;
  transactionSpeed: any;
  estimated: any;
}

export class DeployAccountDevice extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
    address: '',
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.addressChanged = this.addressChanged.bind(this);
    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { address, transactionSpeed, estimated } = this.state;
    return (
      <div>
        <Example
          title="Estimate Account Device Deployment"
          code={code1(address, InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={address && enabled}
          run={this.run1}
        >
          <InputText
            label="deviceAddress"
            value={address}
            onChange={this.addressChanged}
          />
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

  private addressChanged(address: string): void {
    this.setState({
      address,
    });
  }

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run1(): void {
    const { address, transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateAccountDeviceDeployment', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateAccountDeviceDeployment(
          address,
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
