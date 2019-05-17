import React from 'react';
import { Example, InputText, Screen } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (appAlias: string, page = 0) => `
const appAlias = ${appAlias ? `"${appAlias}"` : 'null'};
${page ? `const page = ${page};` : ''}

sdk
  .getConnectedAccountGames(${mergeMethodArgs('appAlias', page && 'page')})
  .then(games => console.log('games', games));
  .catch(console.error);
`;

interface IState {
  appAlias: string;
  page: string;
  pageParsed: number;
}

export class GetConnectedAccountGames extends Screen<IState> {
  public state = {
    appAlias: '',
    page: '0',
    pageParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.appAliasChanged = this.appAliasChanged.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { appAlias, page, pageParsed } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Games"
          code={code(appAlias, pageParsed)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            label="alias"
            type="text"
            value={appAlias}
            onChange={this.appAliasChanged}
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

  private appAliasChanged(appAlias: string) {
    this.setState({
      appAlias,
    });
  }

  private pageChanged(page: string, pageParsed: number) {
    this.setState({
      page,
      pageParsed,
    });
  }

  private run(): void {
    const { appAlias, pageParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountGames', async (console) => {
        console.log('games', await this.sdk.getConnectedAccountGames(appAlias, pageParsed));
      });
  }

}
