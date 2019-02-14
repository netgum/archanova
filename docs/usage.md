# Usage

Create SDK instance:

```js
import { availableEnviroments, Sdk } from '@archanova/wallet-sdk';

const sdk = new Sdk(
  availableEnviroments.development,
  null, 
);
```

Setup SDK:

```js
sdk
  .setup()
  .then(() => console.log('Completed!'));
```

(optional) Connect with `redux`:

```js
import { reduxReducer } from '@archanova/wallet-sdk';
import { combineReducers, createStore, applyMiddleware } from 'redux';

const reducers = combineReducers({
 sdk: reduxReducer,
});

const store = createStore(
  reducers,
  {},
  applyMiddleware(
    sdk.createReduxMiddleware()
  ),
);
```
