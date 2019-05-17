import React from 'react';
import { Example, Screen, InputText } from '../../components';
import { generateRandomAddress, mergeMethodArgs } from '../../shared';

const code = (hash: string, receiver: string) => `
const hash = ${hash ? `"${hash}"` : 'null'};
${receiver ? `const receiver = "${receiver}";` : ''}

sdk
  .grabAccountPayment(${mergeMethodArgs('hash', receiver && 'receiver')})
  .then(accountPayment => console.log('accountPayment', accountPayment));
  .catch(console.error);
`;

interface IState {
  hash: string;
  receiver: string;
}

export class GrabAccountPayment extends Screen<IState> {
  public state = {
    hash: '',
    receiver: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.hashChanged = this.hashChanged.bind(this);
    this.receiverChanged = this.receiverChanged.bind(this);
    this.generateReceiver = this.generateReceiver.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { hash, receiver } = this.state;
    return (
      <div>
        <Example
          title="Grab Account Payment"
          code={code(hash, receiver)}
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
            value={receiver}
            label="receiver"
            type="text"
            onChange={this.receiverChanged}
            onRandomClick={this.generateReceiver}
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
    const { hash } = this.state;
    this
      .logger
      .wrapSync('sdk.grabAccountPayment', async (console) => {
        console.log('accountPayment', await this.sdk.grabAccountPayment(hash));
      });
  }
}
