import React from 'react';
import { Example, InputText, Screen } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (page = 0) => `
${page ? `const page = ${page};` : ''}

sdk
  .getConnectedAccountVirtualBalances(${mergeMethodArgs(page && 'page')})
  .then(accountVirtualBalances => console.log('accountVirtualBalances', accountVirtualBalances));
  .catch(console.error);
`;

interface IState {
  page: string;
  pageParsed: number;
}

export class GetConnectedAccountVirtualBalances extends Screen<IState> {
  public state = {
    page: '0',
    pageParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.pageChanged = this.pageChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { page, pageParsed } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Virtual Balances"
          code={code(pageParsed)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            label="page"
            type="number"
            value={page}
            onChange={this.pageChanged}
          />
        </Example>
      </div>
    );
  }

  private pageChanged(page: string, pageParsed: number) {
    this.setState({
      page,
      pageParsed,
    });
  }

  private run(): void {
    const { pageParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountVirtualBalances', async (console) => {
        console.log('accountVirtualBalances', await this.sdk.getConnectedAccountVirtualBalances(pageParsed));
      });
  }

}
