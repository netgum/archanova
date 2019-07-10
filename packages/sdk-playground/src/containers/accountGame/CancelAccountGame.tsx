import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (id: number) => `
const gameId = ${id ? id : 'null'};

sdk
  .cancelAccountGame(gameId)
  .then(success => console.log('success', success))
  .catch(console.error);
`;

interface IState {
  id: string;
  idParsed: number;
}

export class CancelAccountGame extends Screen<IState> {
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
          title="Cancel Account Game"
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
      .wrapSync('sdk.cancelAccountGame', async (console) => {
        console.log('success', await this.sdk.cancelAccountGame(idParsed));
      });
  }
}
