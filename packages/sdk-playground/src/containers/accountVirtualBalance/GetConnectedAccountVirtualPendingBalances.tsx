import React from 'react';
import { Example, Screen } from '../../components';

const code = () => `
sdk
  .getConnectedAccountVirtualPendingBalances()
  .then(accountVirtualPendingBalances => console.log('accountVirtualPendingBalances', accountVirtualPendingBalances))
  .catch(console.error);
`;

interface IState {
  page: string;
  pageParsed: number;
}

export class GetConnectedAccountVirtualPendingBalances extends Screen<IState> {
  public state = {
    page: '0',
    pageParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Get Connected Account Virtual Pending Balances"
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
      .wrapSync('sdk.getConnectedAccountVirtualPendingBalances', async (console) => {
        console.log('accountVirtualPendingBalances', await this.sdk.getConnectedAccountVirtualPendingBalances());
      });
  }

}
