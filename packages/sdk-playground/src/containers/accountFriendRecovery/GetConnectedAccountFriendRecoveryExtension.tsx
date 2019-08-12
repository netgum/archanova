import React from 'react';
import { Example, Screen } from '../../components';

const code = () => `
sdk
  .getConnectedAccountFriendRecoveryExtension()
  .then(extension => console.log('extension', extension))
  .catch(console.error);
`;

export class GetConnectedAccountFriendRecoveryExtension extends Screen {
  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Get Connected Account Friend Recovery Extension"
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
      .wrapSync('sdk.getConnectedAccountFriendRecoveryExtension', async (console) => {
        console.log('extension', await this.sdk.getConnectedAccountFriendRecoveryExtension());
      });
  }
}
