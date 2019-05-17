import React from 'react';
import { randomBytes } from 'crypto';
import { anyToHex } from '@netgum/utils';
import { Example, Screen, InputText } from '../../components';

const code = (message: string) => `
const message = ${message ? `"${message}"` : 'null'};

console.log('signature', sdk.signPersonalMessage(message));
`;

interface IState {
  message: string;
}

export class SignPersonalMessage extends Screen<IState> {
  public state = {
    message: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.messageChanged = this.messageChanged.bind(this);
    this.generateMessage = this.generateMessage.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { message } = this.state;
    return (
      <div>
        <Example
          title="Sign Personal Message"
          code={code(message)}
          enabled={message && enabled}
          run={this.run}
        >
          <InputText
            value={message}
            label="message"
            type="text"
            onChange={this.messageChanged}
            onRandomClick={this.generateMessage}
          />
        </Example>
      </div>
    );
  }

  private messageChanged(message: string): void {
    this.setState({
      message,
    });
  }

  private generateMessage(): void {
    this.setState({
      message: anyToHex(randomBytes(15), { add0x: true }),
    });
  }

  private run(): void {
    const { message } = this.state;
    this
      .logger
      .wrapSync('sdk.signPersonalMessage', async (console) => {
        console.log('signature', this.sdk.signPersonalMessage(message));
      });
  }
}
