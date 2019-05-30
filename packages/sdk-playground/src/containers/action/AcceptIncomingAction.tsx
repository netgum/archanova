import React from 'react';
import { Example, Screen } from '../../components';

const code = () => `
sdk.acceptIncomingAction();

console.log('action accepted');
`;

export class AcceptIncomingAction extends Screen {
  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Accept Incoming Action"
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
      .wrapSync('sdk.acceptIncomingAction', async (console) => {
        this.sdk.acceptIncomingAction();

        console.log('action accepted');
      });
  }
}
