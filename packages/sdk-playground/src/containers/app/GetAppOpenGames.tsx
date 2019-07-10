import React from 'react';
import { Example, InputText, Screen } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (alias: string, page = 0) => `
const alias = ${alias ? `"${alias}"` : 'null'};
${page ? `const page = ${page};` : ''}

sdk
  .getAppOpenGames(${mergeMethodArgs('alias', page && 'page')})
  .then(games => console.log('games', games))
  .catch(console.error);
`;

interface IState {
  alias: string;
  page: string;
  pageParsed: number;
}

export class GetAppOpenGames extends Screen<IState> {
  public state = {
    alias: 'tictactoe',
    page: '0',
    pageParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.aliasChanged = this.aliasChanged.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { alias, page, pageParsed } = this.state;
    return (
      <div>
        <Example
          title="Get App Open Games"
          code={code(alias, pageParsed)}
          enabled={alias && enabled}
          run={this.run}
        >
          <InputText
            label="alias"
            type="text"
            value={alias}
            onChange={this.aliasChanged}
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

  private aliasChanged(alias: string) {
    this.setState({
      alias,
    });
  }

  private pageChanged(page: string, pageParsed: number) {
    this.setState({
      page,
      pageParsed,
    });
  }

  private run(): void {
    const { alias, pageParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getAppOpenGames', async (console) => {
        console.log('games', await this.sdk.getAppOpenGames(alias, pageParsed));
      });
  }

}
