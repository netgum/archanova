import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (id: number, data: string) => `
const gameId = ${id ? id : 'null'};
const data = ${data ? `'${data}'` : 'null'};

sdk
  .updateAccountGame(gameId, data)
  .then(game => console.log('game', game));
  .catch(console.error);
`;

interface IState {
  id: string;
  idParsed: number;
  data: string;
}

export class UpdateAccountGame extends Screen<IState> {
  public state = {
    id: '0',
    idParsed: 0,
    data: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.idChanged = this.idChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { id, idParsed, data } = this.state;
    return (
      <div>
        <Example
          title="Update Account Game"
          code={code(idParsed, data)}
          enabled={idParsed && enabled}
          run={this.run}
        >
          <InputText
            value={id}
            label="gameId"
            type="number"
            onChange={this.idChanged}
          />
          <InputText
            value={data}
            label="data"
            onChange={this.dataChanged}
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

  private dataChanged(data: string): void {
    this.setState({
      data,
    });
  }

  private run(): void {
    const { idParsed, data } = this.state;
    this
      .logger
      .wrapSync('sdk.updateAccountGame', async (console) => {
        console.log('game', await this.sdk.updateAccountGame(idParsed, data));

        this.setState({
          data: '',
        });
      });
  }
}
