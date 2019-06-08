import React from 'react';
import { Example, Screen } from '../../components';

const code = () => `
sdk
  .submitAccountFriendRecovery()
  .then(hash => console.log('hash', hash))
  .catch(console.error);
`;

export class SubmitAccountFriendRecovery extends Screen {
  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Submit Account Friend Recovery"
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
      .wrapSync('sdk.submitAccountFriendRecovery', async (console) => {
        console.log('hash', await this.sdk.submitAccountFriendRecovery());
      });
  }
}
