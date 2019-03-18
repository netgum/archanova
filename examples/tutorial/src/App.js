import { jsonReplacer } from '@netgum/utils';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Highlight from 'react-highlight';
import { openScreen } from './actions';
import { SdkContext } from './sdk';
import {
  Initialize,
  Reset,
  SetupAccount,
  ManageAccount,
  ManageAccountDevices,
  AccountTransactions,
  screenTypes,
} from './screens';
import { getLocationPort } from './utils';

class App extends Component {
  static contextType = SdkContext;

  acceptIncomingAction() {
    const { sdk } = this.context;
    sdk.acceptIncomingAction();
  }

  dismissIncomingAction() {
    const { sdk } = this.context;
    sdk.dismissIncomingAction();
  }

  render() {
    const { sdk, openScreen } = this.props;
    let { screen } = this.props;
    const { account, initialized, incomingAction } = sdk;

    if (
      screen !== screenTypes.RESET
    ) {
      if (!initialized) {
        screen = screenTypes.INITIALIZE;
      } else if (!account) {
        screen = screenTypes.SETUP_ACCOUNT;
      } else if (
        screen === screenTypes.INITIALIZE ||
        screen === screenTypes.SETUP_ACCOUNT ||
        !screen
      ) {
        screen = screenTypes.MANAGE_ACCOUNT;
      }
    }

    let content = null;

    switch (screen) {
      case screenTypes.INITIALIZE:
        content = <Initialize />;
        break;

      case screenTypes.RESET:
        content = <Reset />;
        break;

      case screenTypes.SETUP_ACCOUNT:
        content = <SetupAccount />;
        break;

      case screenTypes.MANAGE_ACCOUNT:
        content = <ManageAccount />;
        break;

      case screenTypes.MANAGE_ACCOUNT_DEVICES:
        content = <ManageAccountDevices />;
        break;

      case screenTypes.ACCOUNT_TRANSACTIONS:
        content = <AccountTransactions />;
        break;

      default:
        content = null;
    }

    const navOptions = [
      { label: 'Initialize', screen: screenTypes.INITIALIZE, enabled: !initialized },
      { label: 'Reset', screen: screenTypes.RESET, enabled: true },
      {
        label: 'Setup account',
        screen: screenTypes.SETUP_ACCOUNT,
        enabled: initialized && !account,
      },
      { label: 'Manage account', screen: screenTypes.MANAGE_ACCOUNT, enabled: account },
      { label: 'Manage account devices', screen: screenTypes.MANAGE_ACCOUNT_DEVICES, enabled: account },
      { label: 'Account transactions', screen: screenTypes.ACCOUNT_TRANSACTIONS, enabled: account },
    ];

    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col xs={3}>
              <h2>Tutorial@{getLocationPort()}</h2>
              <hr />
              {navOptions.map((option) => (
                <Button
                  key={option.screen}
                  className="text-left"
                  variant="link"
                  block={true}
                  size="sm"
                  disabled={!option.enabled}
                  onClick={() => openScreen(option.screen)}
                >
                  {option.screen === screen
                    ? <b>{option.label}</b>
                    : option.label
                  }
                </Button>
              ))}
            </Col>
            <Col xs={9}>
              {content}
              <hr />
              <p>SDK state:</p>
              <Highlight language="json">
                {JSON.stringify(sdk, jsonReplacer, 2)}
              </Highlight>
            </Col>
          </Row>
        </Container>
        {incomingAction
          ? (
            <Modal show={true}>
              <Modal.Header>
                <Modal.Title>Incoming action</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Action:</p>
                <Highlight language="json">
                  {JSON.stringify(incomingAction, jsonReplacer, 2)}
                </Highlight>
                <p>Accept action:</p>
                <Highlight language="javascript">
                  {'sdk.acceptIncomingAction();'}
                </Highlight>
                <p>Dismiss action:</p>
                <Highlight language="javascript">
                  {'sdk.dismissIncomingAction();'}
                </Highlight>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="success"
                  onClick={() => this.acceptIncomingAction()}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  onClick={() => this.dismissIncomingAction()}
                >
                  Dismiss
                </Button>
              </Modal.Footer>
            </Modal>

          )
          : null
        }
      </div>
    );
  }
}

export default connect(
  ({ sdk, screen }) => ({
    sdk,
    screen,
  }),
  dispatch => ({
    openScreen: screen => dispatch(openScreen(screen)),
  }),
)(App);
