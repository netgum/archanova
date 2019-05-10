# Common Types

### Constants

Exported in `sdkConstants` namespace

```typescript
export enum AccountStates {
  Created = 'Created',
  Deployed = 'Deployed',
}

export enum AccountTypes {
  Developer = 'Developer',
  Admin = 'Admin',
}

export enum AccountDeviceStates {
  Created = 'Created',
  Deployed = 'Deployed',
}

export enum AccountDeviceTypes {
  Owner = 'Owner',
  Delegate = 'Delegate',
  Extension = 'Extension',
}

export enum AccountGameStates {
  Opened = 'Opened',
  Locked = 'Locked',
  Unlocked = 'Unlocked',
  Closed = 'Closed',
}

export enum AccountGamePlayers {
  Creator = 'Creator',
  Opponent = 'Opponent',
}

export enum AccountTransactionTypes {
  Deployment = 'Deployment',
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
}

export enum AppStates {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}
```

## Interfaces

Exported in `sdkInterfaces` namespace

```typescript
import BN from 'bn.js';

export interface IAccount {
  address: string;
  ensName?: string;
  type: AccountTypes;
  state: AccountStates;
  nextState?: AccountStates;
  virtualBalance: BN;
  updatedAt: Date;
}

export interface IAccountDevice {
  device: IDevice;
  type: AccountDeviceTypes;
  state: AccountDeviceStates;
  nextState: AccountDeviceStates;
  updatedAt: Date;
}

export interface IAccountGameHistory {
  player: IAccount;
  stateValue: string;
  updatedAt: Date;
}

export interface IAccountGame {
  id: number;
  app: IApp;
  creator: IAccount;
  opponent: IAccount;
  state: AccountGameStates;
  stateValue: string;
  creatorSignature: Buffer;
  opponentSignature: Buffer;
  guardianSignature: Buffer;
  whoseTurn: AccountGamePlayers;
  winner: AccountGamePlayers;
  deposit: BN;
  updatedAt: Date;
}

export interface IAccountTransaction {
  type: AccountTransactionTypes;
  address: string;
  hash: string;
  value: BN;
  fee: BN;
  updatedAt: Date;
}

export interface IApp {
  creator: IAccount;
  state: AppStates;
  alias: string;
  name: string;
  description: string;
  imageUrl: string;
  updatedAt: string;
}

export interface IDevice {
  address: string;
}

export interface IPaginated<T = any> {
  items: T[];
  currentPage: number;
  nextPage: number;
}
```

