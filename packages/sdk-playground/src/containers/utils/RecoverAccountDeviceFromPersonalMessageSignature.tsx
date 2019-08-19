import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (accountAddress: string, message: string, signature: string) => `
const accountAddress = ${accountAddress ? `"${accountAddress}"` : 'null'};
const message = ${message ? `"${message}"` : 'null'};
const signature = ${signature ? `"${signature}"` : 'null'};

sdk
  .recoverAccountDeviceFromPersonalMessageSignature(hash)
  .then(accountDevice => console.log('accountDevice', accountDevice))
  .catch(console.error);
`;

interface IState {
  accountAddress: string;
  message: string;
  signature: string;
}

export class RecoverAccountDeviceFromPersonalMessageSignature extends Screen<IState> {
  public state = {
    accountAddress: '',
    message: '',
    signature: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.accountAddressChanged = this.accountAddressChanged.bind(this);
    this.messageChanged = this.messageChanged.bind(this);
    this.signatureChanged = this.signatureChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { accountAddress, message, signature } = this.state;
    return (
      <div>
        <Example
          title="Recover Account Device From Personal Message Signature"
          code={code(accountAddress, message, signature)}
          enabled={accountAddress && message && signature && enabled}
          run={this.run}
        >
          <InputText
            value={accountAddress}
            label="accountAddress"
            type="text"
            onChange={this.accountAddressChanged}
          />
          <InputText
            value={message}
            label="message"
            type="text"
            onChange={this.messageChanged}
          />
          <InputText
            value={signature}
            label="signature"
            type="text"
            onChange={this.signatureChanged}
          />
        </Example>
      </div>
    );
  }

  private accountAddressChanged(accountAddress: string): void {
    this.setState({
      accountAddress,
    });
  }

  private messageChanged(message: string): void {
    this.setState({
      message,
    });
  }

  private signatureChanged(signature: string): void {
    this.setState({
      signature,
    });
  }

  private run(): void {
    const { accountAddress, message, signature } = this.state;
    this
      .logger
      .wrapSync('sdk.recoverAccountDeviceFromPersonalMessageSignature', async (console) => {
        console.log('accountDevice', await this.sdk.recoverAccountDeviceFromPersonalMessageSignature(
          accountAddress,
          message,
          signature,
        ));
      });
  }
}
