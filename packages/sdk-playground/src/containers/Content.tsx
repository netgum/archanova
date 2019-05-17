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
  GetConnectedAccountTransactions,
  GetConnectedAccountTransaction,
  SendAccountTransaction,
} from './accountTransaction';
import {
  GetConnectedAccountPayments,
  GetConnectedAccountPayment,
  CreateAccountPayment,
  GrabAccountPayment,
  DepositAccountPayment,
  WithdrawAccountPayment,
} from './accountPayment';
import {
  CreateRequestAddAccountDeviceUrl,
} from './url';
import {
  SignPersonalMessage,
} from './utils';
import Footer from './Footer';

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

      // account transactions
      case Screens.GetConnectedAccountTransactions:
        Screen = GetConnectedAccountTransactions;
        break;

      case Screens.GetConnectedAccountTransaction:
        Screen = GetConnectedAccountTransaction;
        break;

      case Screens.SendAccountTransaction:
        Screen = SendAccountTransaction;
        break;

      // account payments
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

      case Screens.DepositAccountPayment:
        Screen = DepositAccountPayment;
        break;

      case Screens.WithdrawAccountPayment:
        Screen = WithdrawAccountPayment;
        break;

      // url
      case Screens.CreateRequestAddAccountDeviceUrl:
        Screen = CreateRequestAddAccountDeviceUrl;
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
            header: 'Account Transaction',
            screens: [
              Screens.GetConnectedAccountTransactions,
              Screens.GetConnectedAccountTransaction,
              Screens.SendAccountTransaction,
            ],
          }, {
            header: 'Account Payment',
            screens: [
              Screens.GetConnectedAccountPayments,
              Screens.GetConnectedAccountPayment,
              Screens.CreateAccountPayment,
              Screens.GrabAccountPayment,
              Screens.DepositAccountPayment,
              Screens.WithdrawAccountPayment,
            ],
          }, {
            header: 'Url',
            screens: [
              Screens.CreateRequestAddAccountDeviceUrl,
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
          <Footer/>
        </div>
      </div>
    );
  }

  private getEnabledScreens(): { [key: string]: boolean } {
    const { sdk: { account, accountDevice, initialized } } = this.props;

    const accountConnected = initialized && !!account;
    const accountDisconnected = initialized && !account;
    const accountUpdated = accountConnected && !!account.ensName;
    const accountCreated = accountConnected && !account.nextState && account.state === sdkConstants.AccountStates.Created;
    const accountDeployed = accountConnected && !account.nextState && account.state === sdkConstants.AccountStates.Deployed;
    const accountDeviceDeployed = (
      accountConnected && accountDevice && !accountDevice.nextState && accountDevice.state === sdkConstants.AccountDeviceStates.Deployed
    );

    return {
      // sdk
      [Screens.Initialize]: initialized === null,
      [Screens.Reset]: initialized,

      // account
      [Screens.SearchAccount]: initialized,
      [Screens.CreateAccount]: accountDisconnected,
      [Screens.UpdateAccount]: accountCreated,
      [Screens.ConnectAccount]: initialized,
      [Screens.DisconnectAccount]: accountConnected,
      [Screens.DeployAccount]: accountUpdated && accountCreated,
      [Screens.TopUpAccountVirtualBalance]: accountDeviceDeployed,
      [Screens.WithdrawFromAccountVirtualBalance]: accountDeviceDeployed,

      // account transaction
      [Screens.GetConnectedAccountTransactions]: accountConnected,
      [Screens.GetConnectedAccountTransaction]: accountConnected,
      [Screens.SendAccountTransaction]: accountDeviceDeployed,

      // account payment
      [Screens.GetConnectedAccountPayments]: accountConnected,
      [Screens.GetConnectedAccountPayment]: accountConnected,
      [Screens.CreateAccountPayment]: accountDeployed,
      [Screens.GrabAccountPayment]: accountConnected,
      [Screens.DepositAccountPayment]: accountDeviceDeployed,
      [Screens.WithdrawAccountPayment]: accountDeviceDeployed,

      // url
      [Screens.CreateRequestAddAccountDeviceUrl]: accountDisconnected,

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
