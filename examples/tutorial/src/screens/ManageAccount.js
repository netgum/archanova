import React, { Component } from 'react';
import QrCode from 'qrcode.react';
import { SdkContext } from '../sdk';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { Block } from '../components';
import Highlight from 'react-highlight';

export class ManageAccount extends Component {
  static contextType = SdkContext;

  state = {
    qrCodeUrl: null,
  };

  topUpAccount() {
    const { sdk } = this.context;
    sdk
      .topUpAccount()
      .then(receipt => console.log('receipt:', receipt))
      .catch(console.error);
  }

  verifyAccount() {
    const { sdk } = this.context;
    sdk
      .verifyAccount()
      .then(account => console.log('account:', account))
      .catch(console.error);
  }

  deployAccount() {
    const { sdk } = this.context;
    sdk
      .getGasPrice()
      .then((gasPrice) => {
        console.log('gasPrice:', gasPrice);

        return sdk
          .estimateAccountDeployment(gasPrice)
          .then((cost) => {
            console.log('cost:', cost);

            return sdk.deployAccount(gasPrice);
          });
      })
      .then(hash => console.log('hash:', hash))
      .catch(console.error);
  }

  addDevice() {
    const { sdk } = this.context;
    sdk
      .createSecureAddDeviceUrl()
      .then((url) => {
        console.log('url:', url);

        this.setState({
          qrCodeUrl: url,
        });
      })
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <h2>Manage account</h2>
        <hr />
        <Tabs defaultActiveKey="top-up">
          <Tab eventKey="top-up" title="Top-up account">
            {this.renderTopUpAccount()}
          </Tab>
          <Tab eventKey="verify" title="Verify account">
            {this.renderVerifyAccount()}
          </Tab>
          <Tab eventKey="deploy" title="Deploy account">
            {this.renderDeployAccount()}
          </Tab>
          <Tab eventKey="addDevice" title="Add account device">
            {this.renderAddDevice()}
          </Tab>
        </Tabs>
      </div>
    );
  }

  renderTopUpAccount() {
    return (
      <div>
        <Block>
          <Highlight language="javascript">
            {
              `sdk
  .topUpAccount()
  .then(receipt => console.log('receipt:', receipt))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.topUpAccount()}>
            Top-up
          </Button>
        </Block>
      </div>
    );
  }

  renderVerifyAccount() {
    return (
      <div>
        <Block>
          <Highlight language="javascript">
            {
              `sdk
  .verifyAccount()
  .then(account => console.log('account:', account))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.verifyAccount()}>
            Verify
          </Button>
        </Block>
      </div>
    );
  }

  renderDeployAccount() {
    return (
      <div>
        <Block>
          <Highlight language="javascript">
            {
              `sdk
  .getGasPrice()
  .then((gasPrice) => {
    console.log('gasPrice:', gasPrice);

    return sdk
      .estimateAccountDeployment(gasPrice)
      .then((cost) => {
        console.log('cost:', cost);

        return sdk.deployAccount(gasPrice)
      });
  })
  .then(hash => console.log('hash:', hash))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.deployAccount()}>
            Estimate and deploy
          </Button>
        </Block>
      </div>
    );
  }

  renderAddDevice() {
    const { qrCodeUrl } = this.state;
    return (
      <div>
        <Block>
          <p>Add via QR code</p>
          <Highlight language="javascript">
            {
              `sdk
  .createSecureAddDeviceUrl()
  .then((url) => {
    console.log('url:', url);
  })
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.addDevice()}>
            Add device
          </Button>
        </Block>
        {qrCodeUrl
          ? (
            <Block>
              <p>Please scan qr code with SmartSafe app</p>
              <QrCode value={qrCodeUrl} size={250} />
            </Block>
          )
          : null
        }
      </div>
    );
  }
}
