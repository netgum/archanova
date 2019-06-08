import React from 'react';
import { Example, Screen } from '../../components';

const code = () => `
sdk
  .cancelAccountFriendRecovery()
  .then(() => console.log('account friend recovery canceled'))
  .catch(console.error);
`;

export class CancelAccountFriendRecovery extends Screen {
  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Cancel Account Friend Recovery"
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
      .wrapSync('sdk.cancelAccountFriendRecovery', async (console) => {
        await this.sdk.cancelAccountFriendRecovery();
        console.log('account friend recovery canceled');
      });
  }
}
