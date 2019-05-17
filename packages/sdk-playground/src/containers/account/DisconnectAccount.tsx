import React from 'react';
import { Example, Screen } from '../../components';

const code = () => `
sdk
  .disconnectAccount()
  .then(() => console.log('disconnected'))
  .catch(console.error);
`;

export class DisconnectAccount extends Screen {

  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Disconnect Account"
          code={code()}
          enabled={enabled}
          run={this.run}
        />
      </div>
    );
  }

  private run(): void {
    this
      .logger
      .wrapSync('sdk.disconnectAccount', async (console) => {
        await this.sdk.disconnectAccount();
        console.log('disconnected');
      });
  }
}
