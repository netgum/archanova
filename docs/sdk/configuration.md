# Configuration

## Setup SDK Environment

### Predefined Environments
```typescript
import { SdkEnvironmentNames, getSdkEnvironment } from '@archanova/sdk';

const sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Main);
``` 

### Extending Environment

```typescript
import { SdkEnvironmentNames, getSdkEnvironment } from '@archanova/sdk';
import Ws from 'ws';

const sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Rinkeby)
  .setConfig('storageAdapter', sessionStorage)
  .setConfig('apiWebSocketConstructor', Ws) // for nodejs env
  .extendConfig('ensOptions', {
    supportedRootNames: ['smartsafe.test'],
  });
``` 

## Create SDK Instance

```typescript
const sdk = createSdk(sdkEnv); 
```

## Initialize SDK Instance
```typescript
await sdk.initialize();
```
