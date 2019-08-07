export enum Screens {
  // sdk
  Initialize = 'initialize',
  Reset = 'reset',

  // account
  SearchAccount = 'search account',
  CreateAccount = 'create account',
  UpdateAccount = 'update account',
  ConnectAccount = 'connect account',
  DisconnectAccount = 'disconnect account',
  DeployAccount = 'deploy account',

  // account virtual balance
  TopUpAccountVirtualBalance = 'top-up account virtual balance',
  WithdrawFromAccountVirtualBalance = 'withdraw from account virtual balance',
  GetConnectedAccountVirtualBalances = 'get connected account virtual balances',
  GetConnectedAccountVirtualBalance = 'get connected account virtual balance',
  GetConnectedAccountVirtualPendingBalances = 'get connected account virtual pending balances',
  GetConnectedAccountVirtualPendingBalance = 'get connected account virtual pending balance',

  // account friend recovery
  AddAccountFriendRecoveryExtension = 'add account friend recovery extension',
  SetupAccountFriendRecoveryExtension = 'setup account friend recovery extension',
  GetAccountFriendRecovery = 'get account friend recovery',
  StartAccountFriendRecovery = 'start account friend recovery',
  CancelAccountFriendRecovery = 'cancel account friend recovery',
  CollectAccountFriendSignature = 'collect account friend signature',
  SubmitAccountFriendRecovery = 'submit account friend recovery',
  SignAccountFriendRecovery = 'sign account friend recovery',

  // account device
  GetConnectedAccountDevices = 'get connected account devices',
  GetConnectedAccountDevice = 'get connected account device',
  GetAccountDevice = 'get account device',
  CreateAccountDevice = 'create account device',
  RemoveAccountDevice = 'remove account device',
  DeployAccountDevice = 'deploy account device',
  UnDeployAccountDevice = 'un-deploy account device',

  // account transaction
  GetConnectedAccountTransactions = 'get connected account transactions',
  GetConnectedAccountTransaction = 'get connected account transaction',
  SendAccountTransaction = 'send account transaction',

  // account payment
  GetConnectedAccountPayments = 'get connected account payments',
  GetConnectedAccountPayment = 'get connected account payment',
  CreateAccountPayment = 'create account payment',
  SignAccountPayment = 'sign account payment',
  GrabAccountPayment = 'grab account payment',
  DepositAccountPayment = 'deposit account payment',
  WithdrawAccountPayment = 'withdraw account payment',
  CancelAccountPayment = 'cancel account payment',

  // account games
  GetConnectedAccountGames = 'get connected account games',
  GetAccountGame = 'get account game',
  CreateAccountGame = 'create account game',
  JoinAccountGame = 'join account game',
  StartAccountGame = 'start account game',
  UpdateAccountGame = 'update account game',
  CancelAccountGame = 'cancel account game',

  // app
  GetApps = 'get apps',
  GetApp = 'get app',
  GetAppOpenGames = 'get app open games',

  // token
  GetTokens = 'get tokens',
  GetToken = 'get token',
  GetTokenBalance = 'get token balance',

  // action
  AcceptIncomingAction = 'accept incoming action',
  DismissIncomingAction = 'dismiss incoming action',

  // url
  ProcessIncomingUrl = 'process incoming url',
  CreateRequestAddAccountDeviceUrl = 'create request add account device url',
  CreateRequestSignSecureCodeUrl = 'create request sign secure code url',

  // utils
  SignPersonalMessage = 'sign personal message',

  // examples
  PlayTicTacToe = 'play tic-tac-toe',
  MintToken = 'mint token',
}
