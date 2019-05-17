# Api

### `initialize`
```
initialize(options?: { 
  device?: {
    privateKey?: Buffer | string;
  };
}): Promise<void>;
```

### `reset`
```
reset(options: { device?: boolean, session?: boolean } = {}): Promise<void>
```

## Account

### `getConnectedAccounts`
```
getConnectedAccounts(page = 0): Promise<IPaginated<IAccount>>
```

### `searchAccount`
```
searchAccount({ address, ensName }: { address?: string, ensName?: string }): Promise<IAccount>
```

### `createAccount`
```
createAccount(ensLabel?: string, ensRootName?: string): Promise<IAccount>
```

### `connectAccount`
```
connectAccount(accountAddress: string): Promise<IAccount>
```

### `disconnectAccount`
```
disconnectAccount(): Promise<void>
```

### `updateAccount`
```
updateAccount(ensLabel: string, ensRootName?: string): Promise<IAccount>
```

### `estimateAccountDeployment`
```
estimateAccountDeployment(transactionSpeed: Eth.TransactionSpeeds = null): Promise<Account.IEstimatedDeployment>
```

### `deployAccount`
```
deployAccount(transactionSpeed: Eth.TransactionSpeeds = null): Promise<string>
```

### `estimateTopUpAccountVirtualBalance`
```
estimateTopUpAccountVirtualBalance(
  value: number | string | BN,
  transactionSpeed: Eth.TransactionSpeeds = null,
): Promise<AccountTransaction.IEstimatedProxyTransaction>
```

## Account Device

### `getConnectedAccountDevices`
```
getConnectedAccountDevices(page = 0): Promise<IPaginated<IAccountDevice>>
```

### `getConnectedAccountDevice`
```
getConnectedAccountDevice(deviceAddress: string): Promise<IAccountDevice>
```

### `getAccountDevice`
```
getAccountDevice(accountAddress: string = null, deviceAddress: string): Promise<IAccountDevice>
```

### `createAccountDevice`
```
createAccountDevice(deviceAddress: string): Promise<IAccountDevice>
```

### `removeAccountDevice`
```
removeAccountDevice(deviceAddress: string): Promise<boolean>
```

### `estimateAccountDeviceDeployment`
```
estimateAccountDeviceDeployment(
  deviceAddress: string, 
  transactionSpeed: Eth.TransactionSpeeds = null
): Promise<AccountTransaction.IEstimatedProxyTransaction>
```
  
### `estimateAccountDeviceUnDeployment`
```
estimateAccountDeviceUnDeployment(
  deviceAddress: string, 
  transactionSpeed: Eth.TransactionSpeeds = null
): Promise<AccountTransaction.IEstimatedProxyTransaction>
```

## Account Transaction

### `getConnectedAccountTransactions`
```
getConnectedAccountTransactions(page = 0): Promise<IPaginated<IAccountTransaction>>
```

### `getConnectedAccountTransaction`
```
getConnectedAccountTransaction(hash: string): Promise<IAccountTransaction>
```

### `getAccountTransaction`
```
getAccountTransaction(accountAddress: string, hash: string): Promise<IAccountTransaction>
```

### `estimateAccountTransaction`
```
estimateAccountTransaction(
  recipient: string,
  value: number | string | BN,
  data: string | Buffer,
  transactionSpeed: Eth.TransactionSpeeds = null,
): Promise<AccountTransaction.IEstimatedProxyTransaction>
```

### `submitAccountTransaction`
```
submitAccountTransaction(estimated: AccountTransaction.IEstimatedProxyTransaction): Promise<string>
```

## Account Game

(TODO)

## Account Payment

(TODO)

## Apps 

### `getApps`
```
getApps(page = 0): Promise<IPaginated<IApp>>
```

### `getApp`
```
getApp(appAlias: string): Promise<IApp>
```

### `getAppOpenGames`
```
getAppOpenGames(appAlias: string, page = 0): Promise<IPaginated<IAccountGame>>
```

## Actions

### `acceptIncomingAction`
```
acceptIncomingAction(action: Action.IAction = null): this
```

### `dismissIncomingAction`
```
dismissIncomingAction(): this
```

## Url

### `processIncomingUrl`
```
processIncomingUrl(url: string): void
```

### `createRequestAddAccountDeviceUrl`
```
createRequestAddAccountDeviceUrl(
  options: { 
    account?: string, 
    endpoint?: string, 
    callbackEndpoint?: string 
  } = {},
): string
```

### `createRequestSignSecureCodeUrl`
```
createRequestSignSecureCodeUrl(): Promise<string>
```

## Utils

### `signPersonalMessage`
```
signPersonalMessage(message: string | Buffer): Buffer
```
