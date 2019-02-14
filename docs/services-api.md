# Services API

## Account Service `sdk.accountService.*`

* `.account: IAccount` - current account details
* `.account$: Subject<IAccount>` - current account details `rxjs` subject
* `.accountBalance: IBN` - current account balance
* `.accountBalance$: Subject<IBN>` - current account balance `rxjs` subject
* `.accountDevice: IAccountDevice` - current account device details
* `.accountDevice$: Subject<IAccountDevice>` - current account device details `rxjs` subject
* `.reset(): void` - reset account
* `.connectAccount(): Promise<ILinkingService.TUrlCreator>` - returns null when device is connected or `url creator` function which can be used to create account request url
* `.getAccounts(): Promise<IAccount[]>;` - gets all accounts connected with sdk device
* `.getAccountDevice(): Promise<IAccountDevice[]>;` - gets all account devices
* `.getAccountTransactions(): Promise<IAccountTransaction[]>;` - gets all account transactions
* `.requestAddAccountDevice(accountAddress?: string): Promise<ILinkingService.TUrlCreator>;` - returns `url creator` function which can be used to create account request url
* `.createAccountDevice(deviceAddress: string): Promise<boolean>`
* `.removeAccountDevice(deviceAddress: string): Promise<boolean>`
* `.disconnectAccountDevice(): Promise<boolean>`
* `.fetchAccount(): Promise<void>`
* `.fetchAccountDevice(): Promise<void>`
* `.lookupAccountAddress(ensName: string): Promise<string>`

## Account Provider Service

(TODO)

## Account Proxy Service

(TODO)

## Session Service

(TODO)
