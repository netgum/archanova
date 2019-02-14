import { LinkingUrlTargets } from '@archanova/wallet-sdk';

export const SET_SDK_SETUP_COMPLETED = 'SET_SDK_SETUP_COMPLETED';
export const SET_SDK_REQUEST_URL = 'SET_SDK_REQUEST_URL';

export function setSdkSetupCompleted() {
  return {
    type: SET_SDK_SETUP_COMPLETED,
  };
}

export function setSdkRequestUrl(url) {
  return {
    type: SET_SDK_REQUEST_URL,
    payload: url,
  };
}

export function createSdkRequestUrl() {
  return (dispatch, getState, sdk) => {
    const url = sdk.accountService.requestAddAccountDevice()(LinkingUrlTargets.WalletIOS);
    dispatch(setSdkRequestUrl(url));
  };
}

export function sdkSetup() {
  return (dispatch, getState, sdk) => {
    sdk
      .setup()
      .then(() => dispatch(setSdkSetupCompleted()))
      .catch(console.error);
  };
}

