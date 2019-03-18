import 'bootstrap/dist/css/bootstrap.css';
import 'highlight.js/styles/github-gist.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import reducers from './reducers';
import { sdk, SdkProvider } from './sdk';

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(
    sdk.createReduxMiddleware(), // adds sdk redux middleware
  )),
);

ReactDOM.render(
  <Provider store={store}>
    <SdkProvider sdk={sdk}>
      <App />
    </SdkProvider>
  </Provider>,
  document.getElementById('root'),
);
