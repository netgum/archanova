import { Sdk, sdkConstants, sdkInterfaces } from '@archanova/sdk';
import { ethToWei } from '@netgum/utils';
import React from 'react';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Example, InputSelect, InputText, Screen } from '../../components';
import { mergeMethodArgs } from '../../shared';
import styles from './PlayTicTacToe.module.scss';
import { InputBoard } from './ticTacToe';

const APP_ALIAS = 'tictactoe';
const code1 = (depositValue: number, depositToken: string, data: string) => `
${depositToken ? '' : 'import { ethToWei } from \'@netgum/utils\';'}

const appAlias = '${APP_ALIAS}';
const deposit = {
  value: ${!depositToken ? `ethToWei(${depositValue})` : depositValue},
  token: ${depositToken ? `'${depositToken}'` : 'null'},
};
const data = ${data ? `'${data}'` : 'null'};

sdk
  .createAccountGame(appAlias, deposit, data)
  .then(game => console.log('game', game))
  .catch(console.error);
`;

const code2 = (page = 0) => `
const appAlias = '${APP_ALIAS}';
${page ? `const page = ${page};` : ''}

sdk
  .getAppOpenGames(${mergeMethodArgs('appAlias', page && 'page')})
  .then(games => console.log('games', games))
  .catch(console.error);
`;

const code3 = (id: string) => `
const gameId = ${id};

sdk
  .joinAccountGame(gameId)
  .then(game => console.log('game', game))
  .catch(console.error);
`;

const code4 = (id: number) => `
const gameId = ${id};

sdk
  .startAccountGame(gameId)
  .then(game => console.log('game', game))
  .catch(console.error);
`;

const code5 = (id: number, data: string) => `
const gameId = ${id};
const data = '${data}';

sdk
  .updateAccountGame(gameId, data)
  .then(game => console.log('game', game))
  .catch(console.error);
`;

enum Modes {
  Create = 'Create',
  Join = 'Join',
  Play = 'Play',
}

interface IState {
  mode: Modes;
  game: sdkInterfaces.IAccountGame;
  games: sdkInterfaces.IAccountGame[];
  gameId: string;
  depositValue: string;
  depositValueParsed: number;
  depositToken: string;
  data: string;
  nextData: string;
  page: string;
  pageParsed: number;
}

export class PlayTicTacToe extends Screen<IState> {
  private static initState(mode: Modes, state: Partial<IState> = {}): IState {
    let result: IState = null;
    const common = {
      mode,
      games: [],
      gameId: null,
      depositValue: '0',
      depositValueParsed: 0,
      depositToken: '',
      page: '0',
      pageParsed: 0,
    };
    switch (mode) {
      case Modes.Create:
      case Modes.Join: {

        const data = `0x${'0'.repeat(18)}`;
        result = {
          ...common,
          data,
          game: null,
          nextData: data,
        };
        break;
      }

      case Modes.Play:
        const { game } = state;
        const { data } = game;
        result = {
          ...common,
          data,
          game,
          nextData: data,
        };
        break;
    }
    return result;
  }

  public state = PlayTicTacToe.initState(Modes.Create);

  private subscription: Subscription = null;

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);
    this.run3 = this.run3.bind(this);
    this.run4 = this.run4.bind(this);
    this.run5 = this.run5.bind(this);

    this.depositValueChanged = this.depositValueChanged.bind(this);
    this.depositTokenChanged = this.depositTokenChanged.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
    this.gameIdChanged = this.gameIdChanged.bind(this);

    this.subscription = this.sdk
      .event$
      .pipe(
        filter(event => !!event),
        filter(({ name }) => name === Sdk.EventNames.AccountGameUpdated),
        map(({ payload }) => payload),
      )
      .subscribe((game) => {
        this.setState(PlayTicTacToe.initState(Modes.Play, {
          game,
        }));
      });
  }

  public componentWillUnmount(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
        const { depositValue, depositValueParsed, depositToken, data, nextData } = this.state;
        content = (
          <Example
            code={code1(depositValueParsed, depositToken, nextData)}
            enabled={depositValueParsed && enabled}
            run={this.run1}
          >
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
            <InputBoard
              value={data}
              onChange={this.dataChanged}
            />
          </Example>
        );
        break;
      }

      case Modes.Join: {
        const { page, pageParsed, games, gameId } = this.state;
        content = (
          <div>
            <Example
              title="Get Open Games"
              code={code2(pageParsed)}
              enabled={enabled}
              run={this.run2}
            >
              <InputText
                label="page"
                type="number"
                value={page}
                onChange={this.pageChanged}
              />
            </Example>
            {!games || !games.length ? null : (
              <Example
                title="Join Open Game"
                code={code3(gameId)}
                enabled={enabled}
                run={this.run3}
              >
                <InputSelect
                  label="gameId"
                  selected={gameId}
                  values={games.map(({ id }) => `${id}`)}
                  onChange={this.gameIdChanged}
                />
              </Example>
            )}
          </div>
        );
        break;
      }

      case Modes.Play: {
        const {
          game: {
            id,
            state,
            whoseTurn,
            winner,
            creator: { account: creatorAccount },
            opponent: { account: opponentAccount },
          },
        } = this.state;
        const { accountAddress } = this.sdk.state;

        if (
          state === sdkConstants.AccountGameStates.Open || (
            state === sdkConstants.AccountGameStates.Opened &&
            creatorAccount.address !== accountAddress
          )
        ) {
          content = (
            <Example
              title="Waiting for Other Player"
              code={code4(id)}
              enabled={false}
              run={null}
            />
          );
        } else {
          switch (state) {
            case sdkConstants.AccountGameStates.Opened: {
              content = (
                <Example
                  title="Start Game"
                  code={code4(id)}
                  enabled={true}
                  run={this.run4}
                />
              );
              break;
            }
            case sdkConstants.AccountGameStates.Started: {
              const { nextData, data } = this.state;
              let enabled = true;
              let title = 'Make move';

              if (
                (whoseTurn === sdkConstants.AccountGamePlayers.Creator && creatorAccount.address !== accountAddress) ||
                (whoseTurn === sdkConstants.AccountGamePlayers.Opponent && opponentAccount.address !== accountAddress)
              ) {
                enabled = false;
                title = 'Waiting for Other Player';
              }

              content = (
                <Example
                  title={title}
                  code={code5(id, nextData)}
                  enabled={enabled}
                  run={this.run5}
                >
                  <InputBoard
                    value={data}
                    onChange={this.dataChanged}
                    disabled={!enabled}
                  />
                </Example>
              );
              break;
            }

            case sdkConstants.AccountGameStates.Finished: {
              const { nextData, data } = this.state;
              let title: string = 'There was no winner';

              if (winner) {
                title = (
                  (
                    winner === sdkConstants.AccountGamePlayers.Creator &&
                    creatorAccount.address === accountAddress
                  ) ||
                  (
                    winner === sdkConstants.AccountGamePlayers.Opponent &&
                    opponentAccount.address === accountAddress
                  )
                )
                  ? 'You Win'
                  : 'You Lose';
              }

              content = (
                <Example
                  title={title}
                  code={code5(id, nextData)}
                  enabled={false}
                  run={null}
                >
                  <InputBoard
                    value={data}
                    onChange={this.dataChanged}
                    disabled={true}
                  />
                </Example>
              );
              break;
            }
          }
        }
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
        this.setState(PlayTicTacToe.initState(mode));
      }
    };
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

  private dataChanged(nextData: string): void {
    this.setState({
      nextData,
    });
  }

  private pageChanged(page: string, pageParsed: number): void {
    this.setState({
      page,
      pageParsed,
    });
  }

  private gameIdChanged(gameId: string): void {
    this.setState({
      gameId,
    });
  }

  private run1(): void {
    const { depositValueParsed, depositToken, nextData } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccountGame', async (console) => {
        const game = console.log('game', await this.sdk.createAccountGame(
          APP_ALIAS,
          {
            value: depositToken ? depositValueParsed : ethToWei(depositValueParsed),
            token: depositToken || null,
          },
          nextData,
        ));

        this.setState(PlayTicTacToe.initState(Modes.Play, {
          game,
        }));
      });
  }

  private run2(): void {
    const { pageParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getAppOpenGames', async (console) => {
        const { items } = console.log('games', await this.sdk.getAppOpenGames(
          APP_ALIAS,
          pageParsed,
        ));

        this.setState({
          games: items,
          gameId: items.length ? `${items[0].id}` : null,
        });
      });
  }

  private run3(): void {
    const { gameId } = this.state;
    this
      .logger
      .wrapSync('sdk.joinAccountGame', async (console) => {
        const game = console.log('game', await this.sdk.joinAccountGame(parseInt(gameId, 10)));

        this.setState(PlayTicTacToe.initState(Modes.Play, {
          game,
        }));
      });
  }

  private run4(): void {
    const { game } = this.state;
    this
      .logger
      .wrapSync('sdk.startAccountGame', async (console) => {
        console.log('game', await this.sdk.startAccountGame(game.id));
      });
  }

  private run5(): void {
    const { game, nextData } = this.state;
    this
      .logger
      .wrapSync('sdk.updateAccountGame', async (console) => {
        console.log('game', await this.sdk.updateAccountGame(game.id, nextData));
      });
  }
}
