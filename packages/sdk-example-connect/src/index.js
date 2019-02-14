import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { availableEnviroments, Sdk } from '@archanova/wallet-sdk';
import './index.css';
import App from './App';
import reducers from './reducers';

const sdk = new Sdk(
  availableEnviroments.development,
  null,
);

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(
    sdk.createReduxMiddleware(),
    thunk.withExtraArgument(sdk)
  )),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
