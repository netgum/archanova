import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText } from '../../components';

const code = (appAlias: string, deposit: number, data: string) => `
import { ethToWei } from '@netgum/utils';

const appAlias = ${appAlias ? `"${appAlias}"` : 'null'};
const deposit = ethToWei(${deposit});
const data = ${data ? `"${data}"` : 'null'};

sdk
  .createAccountGame(appAlias, deposit, data)
  .then(game => console.log('game', game));
  .catch(console.error);
`;

interface IState {
  appAlias: string;
  deposit: string;
  depositParsed: number;
  data: string;
}

export class CreateAccountGame extends Screen<IState> {
  public state = {
    appAlias: 'tictactoe',
    deposit: '0',
    depositParsed: 0,
    data: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.appAliasChanged = this.appAliasChanged.bind(this);
    this.depositChanged = this.depositChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { appAlias, deposit, depositParsed, data } = this.state;
    return (
      <div>
        <Example
          title="Create Account Game"
          code={code(appAlias, depositParsed, data)}
          enabled={appAlias && data && depositParsed && enabled}
          run={this.run}
        >
          <InputText
            value={appAlias}
            label="appAlias"
            type="text"
            onChange={this.appAliasChanged}
          />
          <InputText
            value={deposit}
            label="deposit"
            type="number"
            decimal={true}
            onChange={this.depositChanged}
          />
          <InputText
            value={data}
            label="data"
            type="text"
            onChange={this.dataChanged}
          />
        </Example>
      </div>
    );
  }

  private appAliasChanged(appAlias: string): void {
    this.setState({
      appAlias,
    });
  }

  private depositChanged(deposit: string, depositParsed: number): void {
    this.setState({
      deposit,
      depositParsed,
    });
  }

  private dataChanged(data: string): void {
    this.setState({
      data,
    });
  }

  private run(): void {
    const { appAlias, depositParsed, data } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccountGame', async (console) => {
        console.log('game', await this.sdk.createAccountGame(
          appAlias,
          ethToWei(depositParsed),
          data,
        ));
      });
  }
}
