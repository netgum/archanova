import { ContractNames } from '@archanova/contracts';
import { Environment } from '../modules';
import {
  SdkEnvironmentNames,
  main,
  ropsten,
  rinkeby,
  kovan,
  sokol,
  xdai,
} from './constants';

/**
 * gets sdk environment by name
 * @param name
 */
export function getSdkEnvironment(name: SdkEnvironmentNames): Environment {
  let result: Environment = null;

  switch (name) {
    case SdkEnvironmentNames.Main:
      result = main;
      break;

    case SdkEnvironmentNames.Ropsten:
      result = ropsten;
      break;

    case SdkEnvironmentNames.Rinkeby:
      result = rinkeby;
      break;

    case SdkEnvironmentNames.Kovan:
      result = kovan;
      break;

    case SdkEnvironmentNames.Sokol:
      result = sokol;
      break;

    case SdkEnvironmentNames.Xdai:
      result = xdai;
      break;
  }

  return result;
}

/**
 * creates local sdk environment
 * @param options
 */
export function createLocalSdkEnvironment(options: { host?: string, port?: number } = {}): Environment {
  return new Environment({
    apiOptions: {
      host: options.host || 'localhost',
      port: options.port || 8880,
      ssl: false,
      reconnectTimeout: 3000,
    },
    ensOptions: {
      supportedRootNames: ['archanova.local'],
    },
    ethOptions: {
      networkId: '65280',
      gasPrice: '0x77359400',
      contractAddresses: {
        [ContractNames.AccountProvider]: '0xf254E687aD631A681cC895Dbdca37230D4a6f06C',
        [ContractNames.AccountProxy]: '0x12939a4d566e460B7024d38b0A54535c8B282484',
        [ContractNames.AccountFriendRecovery]: '0x63636CABbabaDD86D2675110cD469e77Bc87B36A',
        [ContractNames.ENSRegistry]: '0xC5dFc16D722a4fa6afA59d94439c74537A4Ee70E',
        [ContractNames.VirtualPaymentManager]: '0x5E2355b6522F29D3f0096cA9F4343DB23c243586',
      },
    },
    apiWebSocketConstructor: null,
    storageOptions: {
      namespace: '@archanova:local',
    },
    storageAdapter: null,
  });
}
