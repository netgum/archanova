# Usage

### Create SDK instance

```js
import { availableEnviroments, Sdk } from '@archanova/wallet-sdk';

const storage = null; // or storage object

const sdk = new Sdk(
  availableEnviroments.development,
  storage, 
);
```
[more about storage interface](storage-interface.md)


### Setup SDK

```js
sdk
  .setup()
  .then(() => console.log('Completed!'));
```

### Connect with `redux` (optional)

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
