import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText } from '../../components';
import { generateRandomAddress } from '../../shared';

const code = (recipient: string, token: string, value: number) => `
import { ethToWei } from '@netgum/utils';

const recipient = ${recipient ? `"${recipient}"` : 'null'};
const token = ${token ? `"${token}"` : 'null'};
const value = ${token ? value : `ethToWei(${value})`};

sdk
  .createAccountPayment(recipient, token, value)
  .then(accountPayment => console.log('accountPayment', accountPayment))
  .catch(console.error);
`;

interface IState {
  value: string;
  valueParsed: number;
  recipient: string;
  token: string;
}

export class CreateAccountPayment extends Screen<IState> {
  public state = {
    recipient: '',
    token: '',
    value: '0',
    valueParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.valueChanged = this.valueChanged.bind(this);
    this.recipientChanged = this.recipientChanged.bind(this);
    this.tokenChanged = this.tokenChanged.bind(this);
    this.generateRecipient = this.generateRecipient.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { value, valueParsed, token, recipient } = this.state;
    return (
      <div>
        <Example
          title="Create Account Payment"
          code={code(recipient, token, valueParsed)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            value={recipient}
            label="recipient"
            type="text"
            onChange={this.recipientChanged}
            onRandomClick={this.generateRecipient}
          />
          <InputText
            value={token}
            label="tokenAddress"
            type="text"
            onChange={this.tokenChanged}
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

  private tokenChanged(token: string): void {
    this.setState({
      token,
    });
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

  private run(): void {
    const { valueParsed, token, recipient } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccountPayment', async (console) => {
        console.log('accountPayment', await this.sdk.createAccountPayment(
          recipient || null,
          token || null,
          token ? valueParsed : ethToWei(valueParsed)),
        );
      });
  }
}
