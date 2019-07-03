import { sdkConstants, sdkInterfaces } from '@archanova/sdk';
import { Box } from 'ink';
import React from 'react';
import { map } from 'rxjs/operators';
import { Spinner } from './components';
import { Actions } from './constants';
import { AuthAction, Completed, DeployAction, DevelopAction, Help, InitAction, Summary } from './containers';
import { ContextComponent } from './context';

interface IState {
  initialized: boolean;
  completed: boolean;
  action: Actions;
}

export class Main extends ContextComponent<{}, IState> {
  public state: IState = {
    initialized: false,
    completed: false,
    action: null,
  };

  public componentWillMount(): void {
    const { config: { showHelp } } = this.context;
    if (!showHelp) {
      console.clear();

      this.wrapAsync(() => this.initialize());
    }
  }

  public render(): any {
    const { initialized, completed, action } = this.state;
    const { config: { showHelp } } = this.context;

    let content: React.ReactNode = null;
    let showSummary = false;

    if (showHelp) {
      content = <Help />;
    } else if (!initialized) {
      content = <Spinner>Initializing SDK</Spinner>;
    } else {
      switch (action) {
        case Actions.Auth:
          content = completed ? <Completed /> : <AuthAction />;
          break;
        case Actions.Init:
          content = completed ? <Completed /> : <InitAction />;
          break;
        case Actions.Develop:
          content = <DevelopAction />;
          break;
        case Actions.Deploy:
          content = <DeployAction />;
          break;
      }

      showSummary = true;
    }

    return (
      <Box flexDirection={'column'} paddingY={1}>
        {!showSummary ? null : (
          <Summary />
        )}
        {content}
      </Box>
    );
  }

  private async initialize(): Promise<void> {
    const { config: { privateKey, action: configAction }, sdkService } = this.context;

    await sdkService
      .initialize({
        device: {
          privateKey,
        },
      });

    await sdkService.initializeDeveloperApp();

    this.setState({ initialized: true }, () => {
      const { account$, app$ } = sdkService.state;

      const mapper = (account: sdkInterfaces.IAccount, app: any) => {
        let { action } = this.state;
        let completed = false;
        const hasAccount = account && account.type === sdkConstants.AccountTypes.Developer;
        const hasApp = !!app;

        if (!hasAccount) {
          action = Actions.Auth;
        } else {
          switch (configAction) {
            case Actions.Auth:
              action = Actions.Auth;
              completed = true;
              break;

            case Actions.Init:
              action = Actions.Init;
              completed = hasApp;
              break;

            case Actions.Develop:
              action = hasApp ? Actions.Develop : Actions.Init;
              break;

            case Actions.Deploy:
              action = hasApp ? Actions.Deploy : Actions.Init;
              break;
          }
        }

        return {
          action,
          completed,
        };
      };

      account$
        .pipe(map(payload => mapper(payload, app$.value)))
        .subscribe(state => this.setState(state as any));

      app$
        .pipe(map(payload => mapper(account$.value, payload)))
        .subscribe(state => this.setState(state as any));

    });
  }
}
