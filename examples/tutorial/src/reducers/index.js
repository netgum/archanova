import { combineReducers } from 'redux';
import { reduxReducer as sdk } from '@archanova/wallet-sdk';
import { screen } from './screen';

export default combineReducers({
  sdk,
  screen,
});
