# Redux Integration

## Actions
```typescript
import { ReduxSdkActionTypes } from '@archanova/sdk';

interface ISdkReduxAction<T = any> {
  type: ReduxSdkActionTypes;
  payload: T;
}
```

## Reducers

```typescript
import { reduxSdkReducer } from '@archanova/sdk';
import { combineReducers } from 'redux';

export default combineReducers({
  sdk: reduxSdkReducer,
});
```

## Middleware

```typescript
import { createReduxSdkMiddleware, ISdkReduxState } from '@archanova/sdk';
import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';

const sdk; // ... sdk object
const store = createStore<ISdkReduxState>(
  reducers,
  {},
  applyMiddleware(
    createReduxSdkMiddleware(sdk),
  ),
);
```
