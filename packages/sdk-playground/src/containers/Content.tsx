import { sdkConstants, ISdkReduxState } from '@archanova/sdk';
import React from 'react';
import { connect } from 'react-redux';
import { Menu } from '../components';
import { Screens } from './constants';
import styles from './Content.module.scss';
import { Initialize, Reset } from './sdk';
import {
  SearchAccount,
  CreateAccount,
  ConnectAccount,
  UpdateAccount,
  DisconnectAccount,
  DeployAccount,
  TopUpAccountVirtualBalance,
  WithdrawFromAccountVirtualBalance,
} from './account';
import {
  GetConnectedAccountDevices,
  GetConnectedAccountDevice,
  GetAccountDevice,
  CreateAccountDevice,
  RemoveAccountDevice,
  DeployAccountDevice,
  UnDeployAccountDevice,
} from './accountDevice';
import {
  GetConnectedAccountTransactions,
  GetConnectedAccountTransaction,
  SendAccountTransaction,
} from './accountTransaction';
import {
  GetConnectedAccountPayments,
  GetConnectedAccountPayment,
  CreateAccountPayment,
  SignAccountPayment,
  GrabAccountPayment,
  DepositAccountPayment,
  WithdrawAccountPayment,
} from './accountPayment';
import {
  GetConnectedAccountGames,
  GetAccountGame,
  CreateAccountGame,
  JoinAccountGame,
  StartAccountGame,
  UpdateAccountGame,
} from './accountGame';
import {
  GetApps,
  GetApp,
  GetAppOpenGames,
  PlayTicTacToe,
} from './app';
import {
  AcceptIncomingAction,
  DismissIncomingAction,
} from './action';
import {
  ProcessIncomingUrl,
  CreateRequestAddAccountDeviceUrl,
  CreateRequestSignSecureCodeUrl,
} from './url';
import {
  SignPersonalMessage,
} from './utils';

interface IProps {
  sdk: ISdkReduxState;
}

interface IState {
  screen: string;
}

class Content extends React.Component<IProps, IState> {
  private static getScreenNode(screen: string, enabledScreens: { [key: string]: boolean }): React.ReactNode {
    // tslint:disable-next-line:variable-name
    let Screen: React.JSXElementConstructor<{
      enabled: boolean;
    }> = null;

    switch (screen) {
      // sdk
      case Screens.Initialize:
        Screen = Initialize;
        break;

      case Screens.Reset:
        Screen = Reset;
        break;

      // account
      case Screens.SearchAccount:
        Screen = SearchAccount;
        break;

      case Screens.CreateAccount:
        Screen = CreateAccount;
        break;

      case Screens.UpdateAccount:
        Screen = UpdateAccount;
        break;

      case Screens.ConnectAccount:
        Screen = ConnectAccount;
        break;

      case Screens.DisconnectAccount:
        Screen = DisconnectAccount;
        break;

      case Screens.DeployAccount:
        Screen = DeployAccount;
        break;

      case Screens.TopUpAccountVirtualBalance:
        Screen = TopUpAccountVirtualBalance;
        break;

      case Screens.WithdrawFromAccountVirtualBalance:
        Screen = WithdrawFromAccountVirtualBalance;
        break;

      // account device
      case Screens.GetConnectedAccountDevices:
        Screen = GetConnectedAccountDevices;
        break;

      case Screens.GetConnectedAccountDevice:
        Screen = GetConnectedAccountDevice;
        break;

      case Screens.GetAccountDevice:
        Screen = GetAccountDevice;
        break;

      case Screens.CreateAccountDevice:
        Screen = CreateAccountDevice;
        break;

      case Screens.RemoveAccountDevice:
        Screen = RemoveAccountDevice;
        break;

      case Screens.DeployAccountDevice:
        Screen = DeployAccountDevice;
        break;

      case Screens.UnDeployAccountDevice:
        Screen = UnDeployAccountDevice;
        break;

      // account transaction
      case Screens.GetConnectedAccountTransactions:
        Screen = GetConnectedAccountTransactions;
        break;

      case Screens.GetConnectedAccountTransaction:
        Screen = GetConnectedAccountTransaction;
        break;

      case Screens.SendAccountTransaction:
        Screen = SendAccountTransaction;
        break;

      // account payment
      case Screens.GetConnectedAccountPayments:
        Screen = GetConnectedAccountPayments;
        break;

      case Screens.GetConnectedAccountPayment:
        Screen = GetConnectedAccountPayment;
        break;

      case Screens.CreateAccountPayment:
        Screen = CreateAccountPayment;
        break;

      case Screens.GrabAccountPayment:
        Screen = GrabAccountPayment;
        break;

      case Screens.SignAccountPayment:
        Screen = SignAccountPayment;
        break;

      case Screens.DepositAccountPayment:
        Screen = DepositAccountPayment;
        break;

      case Screens.WithdrawAccountPayment:
        Screen = WithdrawAccountPayment;
        break;

      // account games
      case Screens.GetConnectedAccountGames:
        Screen = GetConnectedAccountGames;
        break;

      case Screens.GetAccountGame:
        Screen = GetAccountGame;
        break;

      case Screens.CreateAccountGame:
        Screen = CreateAccountGame;
        break;

      case Screens.JoinAccountGame:
        Screen = JoinAccountGame;
        break;

      case Screens.StartAccountGame:
        Screen = StartAccountGame;
        break;

      case Screens.UpdateAccountGame:
        Screen = UpdateAccountGame;
        break;

      // app
      case Screens.GetApps:
        Screen = GetApps;
        break;

      case Screens.GetApp:
        Screen = GetApp;
        break;

      case Screens.GetAppOpenGames:
        Screen = GetAppOpenGames;
        break;

      case Screens.PlayTicTacToe:
        Screen = PlayTicTacToe;
        break;

      // action
      case Screens.AcceptIncomingAction:
        Screen = AcceptIncomingAction;
        break;

      case Screens.DismissIncomingAction:
        Screen = DismissIncomingAction;
        break;

      // url
      case Screens.ProcessIncomingUrl:
        Screen = ProcessIncomingUrl;
        break;

      case Screens.CreateRequestAddAccountDeviceUrl:
        Screen = CreateRequestAddAccountDeviceUrl;
        break;

      case Screens.CreateRequestSignSecureCodeUrl:
        Screen = CreateRequestSignSecureCodeUrl;
        break;

      // utils
      case Screens.SignPersonalMessage:
        Screen = SignPersonalMessage;
        break;
    }

    return Screen
      ? (
        <Screen
          enabled={enabledScreens[screen]}
        />
      ) : null;
  }

  public state = {
    screen: Screens.Initialize,
  };

  public componentWillMount(): void {
    this.openScreen = this.openScreen.bind(this);
  }

  public render() {
    const { screen } = this.state;

    const enabledScreens = this.getEnabledScreens();
    const screenNode = Content.getScreenNode(screen, enabledScreens);

    return (
      <div className={styles.content}>
        <Menu
          items={[{
            header: 'SDK',
            screens: [
              Screens.Initialize,
              Screens.Reset],
          }, {
            header: 'Account',
            screens: [
              Screens.SearchAccount,
              Screens.CreateAccount,
              Screens.UpdateAccount,
              Screens.ConnectAccount,
              Screens.DisconnectAccount,
              Screens.DeployAccount,
              Screens.TopUpAccountVirtualBalance,
              Screens.WithdrawFromAccountVirtualBalance,
            ],
          }, {
            header: 'Account Devices',
            screens: [
              Screens.GetConnectedAccountDevices,
              Screens.GetConnectedAccountDevice,
              Screens.GetAccountDevice,
              Screens.CreateAccountDevice,
              Screens.RemoveAccountDevice,
              Screens.DeployAccountDevice,
              Screens.UnDeployAccountDevice,
            ],
          }, {
            header: 'Account Transactions',
            screens: [
              Screens.GetConnectedAccountTransactions,
              Screens.GetConnectedAccountTransaction,
              Screens.SendAccountTransaction,
            ],
          }, {
            header: 'Account Payments',
            screens: [
              Screens.GetConnectedAccountPayments,
              Screens.GetConnectedAccountPayment,
              Screens.CreateAccountPayment,
              Screens.SignAccountPayment,
              Screens.GrabAccountPayment,
              Screens.DepositAccountPayment,
              Screens.WithdrawAccountPayment,
            ],
          }, {
            header: 'Account Games',
            screens: [
              Screens.GetConnectedAccountGames,
              Screens.GetAccountGame,
              Screens.CreateAccountGame,
              Screens.JoinAccountGame,
              Screens.StartAccountGame,
              Screens.UpdateAccountGame,
            ],
          }, {
            header: 'Apps',
            screens: [
              Screens.GetApps,
              Screens.GetApp,
              Screens.GetAppOpenGames,
              Screens.PlayTicTacToe,
            ],
          }, {
            header: 'Actions',
            screens: [
              Screens.AcceptIncomingAction,
              Screens.DismissIncomingAction,
            ],
          }, {
            header: 'Urls',
            screens: [
              Screens.ProcessIncomingUrl,
              Screens.CreateRequestAddAccountDeviceUrl,
              Screens.CreateRequestSignSecureCodeUrl,
            ],
          }, {
            header: 'Utils',
            screens: [
              Screens.SignPersonalMessage,
            ],
          }]}
          enabledScreens={enabledScreens}
          activeScreen={screen}
          openScreen={this.openScreen}
        />
        <div className={styles.wrapper}>
          {screenNode}
        </div>
      </div>
    );
  }

  private getEnabledScreens(): { [key: string]: boolean } {
    const { sdk: { account, accountDevice, initialized, incomingAction } } = this.props;

    const accountConnected = initialized && !!account;
    const accountDisconnected = initialized && !account;
    const accountUpdated = accountConnected && !!account.ensName;
    const accountCreated = accountConnected && !account.nextState && account.state === sdkConstants.AccountStates.Created;
    const accountDeployed = accountConnected && !account.nextState && account.state === sdkConstants.AccountStates.Deployed;
    const accountDeviceDeployed = (
      accountConnected && accountDevice && !accountDevice.nextState && accountDevice.state === sdkConstants.AccountDeviceStates.Deployed
    );
    const accountDeviceOwner = (
      accountConnected && accountDevice && accountDevice.type === sdkConstants.AccountDeviceTypes.Owner
    );

    return {
      // sdk
      [Screens.Initialize]: initialized === null,
      [Screens.Reset]: initialized,

      // account
      [Screens.SearchAccount]: true,
      [Screens.CreateAccount]: accountDisconnected,
      [Screens.UpdateAccount]: accountCreated,
      [Screens.ConnectAccount]: initialized,
      [Screens.DisconnectAccount]: accountConnected,
      [Screens.DeployAccount]: accountUpdated && accountCreated,
      [Screens.TopUpAccountVirtualBalance]: accountDeviceDeployed,
      [Screens.WithdrawFromAccountVirtualBalance]: accountDeviceDeployed,

      // account device
      [Screens.GetConnectedAccountDevices]: accountConnected,
      [Screens.GetConnectedAccountDevice]: accountConnected,
      [Screens.GetAccountDevice]: initialized,
      [Screens.CreateAccountDevice]: accountDeviceOwner,
      [Screens.RemoveAccountDevice]: accountDeviceOwner,
      [Screens.DeployAccountDevice]: accountDeviceDeployed && accountDeviceOwner,
      [Screens.UnDeployAccountDevice]: accountDeviceDeployed && accountDeviceOwner,

      // account transaction
      [Screens.GetConnectedAccountTransactions]: accountConnected,
      [Screens.GetConnectedAccountTransaction]: accountConnected,
      [Screens.SendAccountTransaction]: accountDeviceDeployed,

      // account payment
      [Screens.GetConnectedAccountPayments]: accountConnected,
      [Screens.GetConnectedAccountPayment]: accountConnected,
      [Screens.CreateAccountPayment]: accountDeployed,
      [Screens.SignAccountPayment]: accountDeployed,
      [Screens.GrabAccountPayment]: accountConnected,
      [Screens.DepositAccountPayment]: accountDeviceDeployed,
      [Screens.WithdrawAccountPayment]: accountDeviceDeployed,

      // account game
      [Screens.GetConnectedAccountGames]: accountConnected,
      [Screens.GetAccountGame]: accountConnected,
      [Screens.CreateAccountGame]: accountDeviceOwner,
      [Screens.JoinAccountGame]: accountDeviceDeployed && accountDeviceOwner,
      [Screens.StartAccountGame]: accountDeviceDeployed && accountDeviceOwner,
      [Screens.UpdateAccountGame]: accountDeployed && accountConnected,

      // app
      [Screens.GetApps]: initialized,
      [Screens.GetApp]: initialized,
      [Screens.GetAppOpenGames]: initialized,
      [Screens.PlayTicTacToe]: accountDeployed,

      // action
      [Screens.AcceptIncomingAction]: !!incomingAction,
      [Screens.DismissIncomingAction]: !!incomingAction,

      // url
      [Screens.ProcessIncomingUrl]: initialized,
      [Screens.CreateRequestAddAccountDeviceUrl]: accountDisconnected,
      [Screens.CreateRequestSignSecureCodeUrl]: accountDeviceOwner,

      // utils
      [Screens.SignPersonalMessage]: initialized,
    };
  }

  private openScreen(screen: string): void {
    this.setState({
      screen,
    });
  }
}

export default connect<IProps, {}, {}, IProps>(
  state => state,
)(Content);
