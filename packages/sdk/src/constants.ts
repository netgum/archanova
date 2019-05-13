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
  Open = 'Open',
  Opened = 'Opened',
  Started = 'Started',
  Finished = 'Finished',
}

export enum AccountGamePlayers {
  Creator = 'Creator',
  Opponent = 'Opponent',
}

export enum AccountTransactionTypes {
  CreateAccount = 'CreateAccount',
  AddDevice = 'AddDevice',
  RemoveDevice = 'RemoveDevice',
  ExecuteTransaction = 'ExecuteTransaction',
}

export enum AccountTransactionStates {
  Created = 'Created',
  Completed = 'Completed',
}

export enum AccountPaymentStates {
  Reserved = 'Reserved',
  Locked = 'Locked',
  Created = 'Created',
  Signed = 'Signed',
  Completed = 'Completed',
  Processed = 'Processed',
}

export enum AppStates {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}
