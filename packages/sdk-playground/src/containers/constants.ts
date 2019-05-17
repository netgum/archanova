export enum Screens {
  // sdk
  Initialize = 'initialize',
  Reset = 'reset',

  // account
  SearchAccount = 'searchAccount',
  CreateAccount = 'createAccount',
  UpdateAccount = 'updateAccount',
  ConnectAccount = 'connectAccount',
  DisconnectAccount = 'disconnectAccount',
  DeployAccount = 'deployAccount',
  TopUpAccountVirtualBalance = 'topUpAccountVirtualBalance',
  WithdrawFromAccountVirtualBalance = 'withdrawFromAccountVirtualBalance',

  // account transaction
  GetConnectedAccountTransactions = 'getConnectedAccountTransactions',
  GetConnectedAccountTransaction = 'getConnectedAccountTransaction',
  SendAccountTransaction = 'sendAccountTransaction',

  // account payment
  GetConnectedAccountPayments = 'getConnectedAccountPayments',
  GetConnectedAccountPayment = 'getConnectedAccountPayment',
  CreateAccountPayment = 'createAccountPayment',
  GrabAccountPayment = 'grabAccountPayment',
  DepositAccountPayment = 'depositAccountPayment',
  WithdrawAccountPayment = 'withdrawAccountPayment',

  // url
  CreateRequestAddAccountDeviceUrl = 'createRequestAddAccountDeviceUrl',

  // utils
  SignPersonalMessage = 'signPersonalMessage',
}
