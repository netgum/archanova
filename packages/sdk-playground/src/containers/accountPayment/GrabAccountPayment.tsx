import React from 'react';
import { Example, Screen, InputText } from '../../components';
import { generateRandomAddress, mergeMethodArgs } from '../../shared';

const code = (hash: string, recipient: string) => `
const hash = ${hash ? `"${hash}"` : 'null'};
${recipient ? `const recipient = "${recipient}";` : ''}

sdk
  .grabAccountPayment(${mergeMethodArgs('hash', recipient && 'recipient')})
  .then(accountPayment => console.log('accountPayment', accountPayment))
  .catch(console.error);
`;

interface IState {
  hash: string;
  recipient: string;
}

export class GrabAccountPayment extends Screen<IState> {
  public state = {
    hash: '',
    recipient: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.hashChanged = this.hashChanged.bind(this);
    this.recipientChanged = this.recipientChanged.bind(this);
    this.generateRecipient = this.generateRecipient.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { hash, recipient } = this.state;
    return (
      <div>
        <Example
          title="Grab Account Payment"
          code={code(hash, recipient)}
          enabled={hash && enabled}
          run={this.run}
        >
          <InputText
            value={hash}
            label="hash"
            type="text"
            onChange={this.hashChanged}
          />
          <InputText
            value={recipient}
            label="recipient"
            type="text"
            onChange={this.recipientChanged}
            onRandomClick={this.generateRecipient}
          />
        </Example>
      </div>
    );
  }

  private hashChanged(hash: string): void {
    this.setState({
      hash,
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
    const { hash, recipient } = this.state;
    this
      .logger
      .wrapSync('sdk.grabAccountPayment', async (console) => {
        console.log('accountPayment', await this.sdk.grabAccountPayment(hash, recipient || null));
      });
  }
}
