import React, { Component } from 'react';
import Highlight from 'react-highlight';
import { Button, Table, Tabs, Tab } from 'react-bootstrap';
import QrCode from 'qrcode.react';
import { Block } from '../components';
import { SdkContext } from '../sdk';
import { generateRandomEnsLabel, getCurrentEndpoint, getTargetEndpoint } from '../utils';

export class SetupAccount extends Component {
  static contextType = SdkContext;

  state = {
    endLabel: generateRandomEnsLabel(),
    accounts: null,
    requestQrCode: null,
  };

  createAccount(endLabel = null) {
    const { sdk } = this.context;
    sdk
      .createAccount(endLabel)
      .then(account => console.log('account:', account))
      .catch(console.error);
  }

  getAccounts() {
    const { sdk } = this.context;
    sdk
      .getAccounts()
      .then((accounts) => {
        console.log('accounts:', accounts);
        this.setState({
          accounts,
        });
      })
      .catch(console.error);
  }

  connectAccount(accountAddress) {
    const { sdk } = this.context;
    sdk
      .connectAccount(accountAddress)
      .then(account => console.log('account:', account))
      .catch(console.error);
  }

  createRequestUrl(options) {
    const { sdk } = this.context;

    const url = sdk.createRequestAddAccountDeviceUrl(options);

    console.log('url:', url);

    if (options) {
      document.location = url;
    } else {
      this.setState({
        requestQrCode: url,
      });
    }
  }

  render() {
    return (
      <div>
        <h2>Setup account</h2>
        <hr />
        <Tabs defaultActiveKey="create">
          <Tab eventKey="create" title="Create account">
            {this.renderCreateAccount()}
          </Tab>
          <Tab eventKey="connect" title="Connect account">
            {this.renderConnectAccount()}
          </Tab>
          <Tab eventKey="request" title="Request Account">
            {this.renderRequestAccount()}
          </Tab>
        </Tabs>
      </div>
    );
  }

  renderCreateAccount() {
    const { endLabel } = this.state;
    return (
      <div>
        <Block>
          <p>Create account with ENS label:</p>
          <Highlight language="javascript">
            {
              `const ensLabel = '${endLabel}';
sdk
  .createAccount(ensLabel)
  .then(account => console.log('account:', account))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.createAccount(endLabel)}>
            Create account
          </Button>
        </Block>
        <Block>
          <p>Create anonymous account:</p>
          <Highlight language="javascript">
            {
              `sdk
  .createAccount()
  .then(account => console.log('account:', account))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.createAccount()}>
            Create account
          </Button>
        </Block>
      </div>
    );
  }

  renderConnectAccount() {
    const { accounts } = this.state;
    return (
      <div>
        <Block>
          <p>Get connected accounts:</p>
          <Highlight language="javascript">
            {
              `sdk
  .getAccounts()
  .then(accounts => console.log('accounts:', account))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.getAccounts()}>
            Get accounts
          </Button>
        </Block>
        {accounts && accounts.length
          ? (
            <Block>
              <p>Connect account:</p>
              <Highlight language="javascript">
                {
                  `const accountAddress = '${accounts[0].address}';
sdk
  .connectAccount(accountAddress)
  .then(account => console.log('account:', account))
  .catch(console.error);`
                }
              </Highlight>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Account address</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(({ id, address }) => (
                    <tr key={id}>
                      <td>{address}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => this.connectAccount(address)}
                        >
                          Connect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Block>
          )
          : null
        }
      </div>
    );
  }

  renderRequestAccount() {
    const { requestQrCode } = this.state;
    const endpoint = getTargetEndpoint();
    const callbackEndpoint = getCurrentEndpoint();

    return (
      <div>
        <Block>
          <p>Request via qr code:</p>
          <Highlight language="javascript">
            {
              `const url = sdk.createRequestAddAccountDeviceUrl();
console.log('url:', url);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.createRequestUrl()}>
            Request
          </Button>
        </Block>
        {requestQrCode
          ? (
            <Block>
              <p>Please scan qr code with SmartSafe app</p>
              <QrCode value={requestQrCode} size={250} />
            </Block>
          )
          : null
        }

        <Block>
          <p>Request via redirect:</p>
          <Highlight language="javascript">
            {
              `const url = sdk.createRequestAddAccountDeviceUrl({
  endpoint: '${endpoint}',
  callbackEndpoint: '${callbackEndpoint}',
});
console.log('url:', url);`
            }
          </Highlight>
          <Button
            variant="primary"
            onClick={() => this.createRequestUrl({ endpoint, callbackEndpoint })}
          >
            Request
          </Button>
        </Block>
      </div>
    );
  }
}
