export interface IRequestAddAccountDevice {
  accountAddress?: string;
  deviceAddress: string;
  callbackEndpoint?: string;
}

export interface IAccountDeviceAdded {
  accountAddress: string;
}

export interface IRequestSignSecureCode {
  code: string;
  creatorAddress: string;
}
