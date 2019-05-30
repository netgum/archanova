import React from 'react';
import { Example, Screen } from '../../components';

const code = () => `
sdk.dismissIncomingAction();

console.log('action dismissed');
`;

export class DismissIncomingAction extends Screen {
  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Dismiss Incoming Action"
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
      .wrapSync('sdk.dismissIncomingAction', async (console) => {
        this.sdk.dismissIncomingAction();
        console.log('action dismissed');
      });
  }
}
