import './index.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { configureSdk, configureStore } from './configure';
import { logger, help, context } from './shared';
import { config } from './config';

const sdk = configureSdk(logger);
const store = configureStore(sdk);

render(
  <Provider store={store}>
    <context.Provider value={{
      config,
      sdk,
      logger,
      help,
    }}>
      <App />
    </context.Provider>
  </Provider>,
  document.getElementById('root'),
);
