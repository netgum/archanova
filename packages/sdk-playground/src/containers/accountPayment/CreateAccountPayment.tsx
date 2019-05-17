import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText } from '../../components';
import { generateRandomAddress } from '../../shared';

const code = (receiver: string, value: number) => `
import { ethToWei } from '@netgum/utils';

const receiver = ${receiver ? `"${receiver}"` : 'null'};
const value = ethToWei(${value});

sdk
  .createAccountPayment(receiver, value)
  .then(accountPayment => console.log('accountPayment', accountPayment));
  .catch(console.error);
`;

interface IState {
  value: string;
  valueParsed: number;
  receiver: string;
}

export class CreateAccountPayment extends Screen<IState> {
  public state = {
    receiver: '',
    value: '0',
    valueParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.valueChanged = this.valueChanged.bind(this);
    this.receiverChanged = this.receiverChanged.bind(this);
    this.generateReceiver = this.generateReceiver.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { value, valueParsed, receiver } = this.state;
    return (
      <div>
        <Example
          title="Create Account Payment"
          code={code(receiver, valueParsed)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            value={receiver}
            label="receiver"
            type="text"
            onChange={this.receiverChanged}
            onRandomClick={this.generateReceiver}
          />
          <InputText
            value={value}
            label="value"
            type="number"
            decimal={true}
            onChange={this.valueChanged}
          />
        </Example>
      </div>
    );
  }

  private valueChanged(value: string, valueParsed: number): void {
    this.setState({
      value,
      valueParsed,
    });
  }

  private receiverChanged(receiver: string): void {
    this.setState({
      receiver,
    });
  }

  private generateReceiver(): void {
    this.setState({
      receiver: generateRandomAddress(),
    });
  }

  private run(): void {
    const { valueParsed, receiver } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccountPayment', async (console) => {
        console.log('accountPayment', await this.sdk.createAccountPayment(
          receiver || null,
          ethToWei(valueParsed)),
        );
      });
  }
}
