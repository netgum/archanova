import { combineReducers } from 'redux';
import { reduxReducer as sdk } from '@archanova/wallet-sdk';
import { SET_SDK_SETUP_COMPLETED, SET_SDK_REQUEST_URL } from './actions';

function sdkSetupCompleted(state = false, action) {
  switch (action.type) {
    case SET_SDK_SETUP_COMPLETED:
      return true;

    default:
      return state;
  }
}
function sdkRequestUrl(state = null, action) {
  switch (action.type) {
    case SET_SDK_REQUEST_URL:
      return action.payload;

    default:
      return state;
  }
}

export default combineReducers({
  sdk,
  sdkSetupCompleted,
  sdkRequestUrl,
});
