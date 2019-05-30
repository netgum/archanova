import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (id: number) => `
const gameId = ${id ? id : 'null'};

sdk
  .getAccountGame(gameId)
  .then(game => console.log('game', game));
  .catch(console.error);
`;

interface IState {
  id: string;
  idParsed: number;
}

export class GetAccountGame extends Screen<IState> {
  public state = {
    id: '0',
    idParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.idChanged = this.idChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { id, idParsed } = this.state;
    return (
      <div>
        <Example
          title="Get Account Game"
          code={code(idParsed)}
          enabled={idParsed && enabled}
          run={this.run}
        >
          <InputText
            value={id}
            label="gameId"
            type="number"
            onChange={this.idChanged}
          />
        </Example>
      </div>
    );
  }

  private idChanged(id: string, idParsed: number): void {
    this.setState({
      id,
      idParsed,
    });
  }

  private run(): void {
    const { idParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccountGame', async (console) => {
        console.log('game', await this.sdk.getAccountGame(idParsed));
      });
  }
}
