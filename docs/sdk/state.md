# State

Sdk `state` is available in `sdk.state`, it's a combination of `getters` and `rxjs` `Subjects`.

```typescript
import BN from 'bn.js';
import { Subject } from 'rxjs';
import { sdkModules, sdkInterfaces } from '@archanova/sdk';

interface IState {
  initialized$: Subject<boolean>;
  connected$: Subject<boolean>;
  authenticated$: Subject<boolean>;
  account$: Subject<sdkInterfaces.IAccount>;
  accountDevice$: Subject<sdkInterfaces.IAccountDevice>;
  device$: Subject<sdkInterfaces.IDevice>;
  ens$: Subject<sdkModules.State.IEns>;
  eth$: Subject<sdkModules.State.IEth>;
  session$: Subject<sdkModules.State.ISession>;
  incomingAction$: Subject<sdkModules.Action.IAction>;
  
  initialized: boolean;
  connected: boolean;
  authenticated: boolean;
  account: sdkInterfaces.IAccount;
  accountAddress: string;
  accountDevice: sdkInterfaces.IAccountDevice;
  device: sdkInterfaces.IDevice;
  deviceAddress: string;
  ens: sdkModules.State.IEns;
  eth: sdkModules.State.IEth;
  session: sdkModules.State.ISession;
  sessionToken: string;
  incomingAction: sdkModules.Action.IAction;
}
```  
