/* eslint-disable jsx-a11y/anchor-is-valid,no-script-url */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sdkSetup, createSdkRequestUrl } from './actions';
import QrCode from 'qrcode.react';

class App extends Component {
  render() {
    const {
      sdkAccount,
      sdkDevice,
      sdkSetupCompleted,
      sdkRequestUrl,
      sdkSetup,
      createSdkRequestUrl,
    } = this.props;

    if (!sdkSetupCompleted) { // Step 1
      return (
        <div>
          <p>Step 1. Setup SDK</p>
          <p>
            <a
              className="App-link"
              href="javascript:void(0);"
              onClick={sdkSetup}
            >
              Setup
            </a>
          </p>
        </div>
      );

    } else if (!sdkAccount && !sdkRequestUrl) { // Step 2
      return (
        <div>
          <p>Step 2. Create Account Request URL</p>
          <p>
            <a
              className="App-link"
              href="javascript:void(0);"
              onClick={createSdkRequestUrl}
            >
              Create
            </a>
          </p>
          <small>Device {sdkDevice.address}</small>
        </div>
      );
    } else if (!sdkAccount && sdkRequestUrl) { // Step 3
      return (
        <div>
          <p>Step 3. Scan QR Code with your SmartSafe app</p>
          <p>
            <QrCode size={180} value={sdkRequestUrl} />
          </p>
          <small>Device {sdkDevice.address}</small>
        </div>
      );
    } else if (sdkAccount) { // Completed
      return (
        <div>
          <p>
            Account Connected!
          </p>
          <small>Account {sdkAccount.address}</small>
          <small>Device {sdkDevice.address}</small>
        </div>
      );
    }

    return null;
  }
}

export default connect(
  state => ({
    sdkAccount: state.sdk.account,
    sdkDevice: state.sdk.device,
    sdkSetupCompleted: state.sdkSetupCompleted,
    sdkRequestUrl: state.sdkRequestUrl,
  }),
  dispatch => ({
    sdkSetup: () => dispatch(sdkSetup()),
    createSdkRequestUrl: () => dispatch(createSdkRequestUrl()),
  }),
)(App);
