import './index.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { configureSdk, configureStore } from './configure';
import { logger, context } from './shared';

const sdk = configureSdk(logger);
const store = configureStore(sdk);

render(
  <Provider store={store}>
    <context.Provider value={{
      sdk,
      logger,
    }}>
      <App />
    </context.Provider>
  </Provider>,
  document.getElementById('root'),
);
