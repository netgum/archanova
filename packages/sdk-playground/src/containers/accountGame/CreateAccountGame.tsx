import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText } from '../../components';

const code = (appAlias: string, depositValue: number, depositToken: string, data: string) => `
${depositToken ? '' : 'import { ethToWei } from \'@netgum/utils\';'}

const appAlias = ${appAlias ? `"${appAlias}"` : 'null'};
const deposit = {
  value: ${!depositToken ? `ethToWei(${depositValue})` : depositValue},
  token: ${depositToken ? `'${depositToken}'` : 'null'},
};
const data = ${data ? `"${data}"` : 'null'};

sdk
  .createAccountGame(appAlias, deposit, data)
  .then(game => console.log('game', game))
  .catch(console.error);
`;

interface IState {
  appAlias: string;
  depositValue: string;
  depositValueParsed: number;
  depositToken: string;
  data: string;
}

export class CreateAccountGame extends Screen<IState> {
  public state = {
    appAlias: 'tictactoe',
    depositValue: '0',
    depositValueParsed: 0,
    depositToken: '',
    data: '0x000000000000000000',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.appAliasChanged = this.appAliasChanged.bind(this);
    this.depositValueChanged = this.depositValueChanged.bind(this);
    this.depositTokenChanged = this.depositTokenChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { appAlias, depositValue, depositValueParsed, depositToken, data } = this.state;
    return (
      <div>
        <Example
          title="Create Account Game"
          code={code(appAlias, depositValueParsed, depositToken, data)}
          enabled={appAlias && data && depositValueParsed && enabled}
          run={this.run}
        >
          <InputText
            value={appAlias}
            label="appAlias"
            type="text"
            onChange={this.appAliasChanged}
          />
          <InputText
            value={depositValue}
            label="deposit.value"
            type="number"
            decimal={true}
            onChange={this.depositValueChanged}
          />
          <InputText
            value={depositToken}
            label="deposit.token"
            onChange={this.depositTokenChanged}
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

  private depositValueChanged(depositValue: string, depositValueParsed: number): void {
    this.setState({
      depositValue,
      depositValueParsed,
    });
  }

  private depositTokenChanged(depositToken: string): void {
    this.setState({
      depositToken,
    });
  }

  private dataChanged(data: string): void {
    this.setState({
      data,
    });
  }

  private run(): void {
    const { appAlias, depositValueParsed, depositToken, data } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccountGame', async (console) => {
        console.log('game', await this.sdk.createAccountGame(
          appAlias, {
            value: depositToken ? depositValueParsed : ethToWei(depositValueParsed),
            token: depositToken || null,
          },
          data,
        ));
      });
  }
}
