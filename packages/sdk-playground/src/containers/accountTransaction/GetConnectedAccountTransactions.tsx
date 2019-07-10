import React from 'react';
import { Example, InputText, Screen } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (page = 0, hash: string) => `
const hash = ${hash ? `"${hash}"` : 'null'};
${page ? `const page = ${page};` : ''}


sdk
  .getConnectedAccountTransactions(${mergeMethodArgs('hash', page && 'page')})
  .then(accountTransactions => console.log('accountTransactions', accountTransactions))
  .catch(console.error);
`;

interface IState {
  page: string;
  pageParsed: number;
  hash: string;
}

export class GetConnectedAccountTransactions extends Screen<IState> {
  public state = {
    hash: '',
    page: '0',
    pageParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.hashChanged = this.hashChanged.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { page, hash, pageParsed } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Transactions"
          code={code(pageParsed, hash)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            value={hash}
            label="hash"
            type="text"
            onChange={this.hashChanged}
          />
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

  private hashChanged(hash: string): void {
    this.setState({
      hash,
    });
  }

  private pageChanged(page: string, pageParsed: number) {
    this.setState({
      page,
      pageParsed,
    });
  }

  private run(): void {
    const { hash, pageParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountTransactions', async (console) => {
        console.log('accountTransactions', await this.sdk.getConnectedAccountTransactions(hash, pageParsed));
      });
  }

}
