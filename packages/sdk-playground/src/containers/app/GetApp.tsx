import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (alias: string) => `
const alias = ${alias ? `"${alias}"` : 'null'};

sdk
  .getApp(alias)
  .then(app => console.log('app', alias))
  .catch(console.error);
`;

interface IState {
  alias: string;
}

export class GetApp extends Screen<IState> {
  public state = {
    alias: 'tictactoe',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.aliasChanged = this.aliasChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { alias } = this.state;
    return (
      <div>
        <Example
          title="Get App"
          code={code(alias)}
          enabled={alias && enabled}
          run={this.run}
        >
          <InputText
            value={alias}
            label="alias"
            type="text"
            onChange={this.aliasChanged}
          />
        </Example>
      </div>
    );
  }

  private aliasChanged(alias: string): void {
    this.setState({
      alias,
    });
  }

  private run(): void {
    const { alias } = this.state;
    this
      .logger
      .wrapSync('sdk.getApp', async (console) => {
        console.log('app', await this.sdk.getApp(alias));
      });
  }
}
