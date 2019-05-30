import { ethToWei } from '@netgum/utils';
import React from 'react';
import { Example, InputText, Screen } from '../../components';
import { InputBoard } from './ticTacToe';
import styles from './PlayTicTacToe.module.scss';

const code1 = (deposit: number, data: string) => `
import { ethToWei } from '@netgum/utils';

const appAlias = 'tictactoe';
const deposit = ethToWei(${deposit});
const data = ${data ? `"${data}"` : 'null'};

sdk
  .createAccountGame(appAlias, deposit, data)
  .then(game => console.log('game', game));
  .catch(console.error);
`;

enum Modes {
  Create = 'Create',
  Join = 'Join',
  Play = 'Play',
}

interface IState {
  mode: Modes;
  game: any;
  deposit: string;
  depositParsed: number;
  data: string;
  nextData: string;
}

export class PlayTicTacToe extends Screen<IState> {
  public state = {
    mode: Modes.Create,
    game: null,
    deposit: '0',
    depositParsed: 0,
    data: `0x${'0'.repeat(18)}`,
    nextData: `0x${'0'.repeat(18)}`,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);

    this.depositChanged = this.depositChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
  }

  public renderTabs(): any {
    const { mode, game } = this.state;
    return (
      <div className={styles.tabs}>
        <button
          className={mode === Modes.Create ? styles.active : ''}
          onClick={this.createChangeTabHandler(Modes.Create)}
        >
          New Game
        </button>
        <button
          className={mode === Modes.Join ? styles.active : ''}
          onClick={this.createChangeTabHandler(Modes.Join)}
        >
          Join Game
        </button>
        <button
          className={mode === Modes.Play ? styles.active : ''}
          disabled={!game}
          onClick={this.createChangeTabHandler(Modes.Play)}
        >
          Play Game
        </button>
      </div>
    );
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { mode } = this.state;

    let content: any = null;

    switch (mode) {
      case Modes.Create: {
        const { deposit, depositParsed, data, nextData } = this.state;
        content = (
          <div>
            <Example
              title="Create Account Game"
              code={code1(depositParsed, nextData)}
              enabled={depositParsed && enabled}
              run={this.run1}
            >
              <InputText
                value={deposit}
                label="deposit"
                type="number"
                decimal={true}
                onChange={this.depositChanged}
              />
              <InputBoard
                value={data}
                onChange={this.dataChanged}
              />
            </Example>
          </div>
        );
        break;
      }
    }

    return (
      <div>
        {this.renderTabs()}
        {content}
      </div>
    );
  }

  private createChangeTabHandler(mode: Modes): () => any {
    return () => {
      if (this.state.mode !== mode) {
        this.setState({
          mode,
        });
      }
    };
  }

  private depositChanged(deposit: string, depositParsed: number): void {
    this.setState({
      deposit,
      depositParsed,
    });
  }

  private dataChanged(nextData: string): void {
    this.setState({
      nextData,
    });
  }

  private run1(): void {
    const { depositParsed, nextData } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccountGame', async (console) => {
        const game = console.log('game', await this.sdk.createAccountGame(
          'tictactoe',
          ethToWei(depositParsed),
          nextData,
        ));

        this.setState({
          game,
          mode: Modes.Play,
          deposit: '0',
          depositParsed: 0,
        });
      });
  }
}
