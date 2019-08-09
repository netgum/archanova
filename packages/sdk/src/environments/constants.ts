import { ContractNames } from '@archanova/contracts';
import { Environment } from '../modules';

export enum SdkEnvironmentNames {
  Main = 'main',
  Ropsten = 'ropsten',
  Rinkeby = 'rinkeby',
  Kovan = 'kovan',
  Sokol = 'sokol',
  Xdai = 'xdai',
  Preview = 'preview',
}

const mainConfig: Environment.IConfigs = {
  apiOptions: {
    host: 'archanova.run',
    ssl: true,
    reconnectTimeout: 3000,
  },
  ensOptions: {
    supportedRootNames: ['myarchanova.xyz'],
  },
  ethOptions: {
    networkId: '1',
  },
  apiWebSocketConstructor: null,
  storageOptions: {
    namespace: '@archanova:main',
  },
  storageAdapter: null,
};

export const main = new Environment(Object.create(mainConfig))
  .extendConfig('ethOptions', {
    contractAddresses: {
      [ContractNames.ENSRegistry]: '0x314159265dD8dbb310642f98f50C066173C1259b',
    },
  });

export const ropsten = (new Environment(Object.create(mainConfig)))
  .extendConfig('apiOptions', {
    host: 'ropsten.archanova.run',
  })
  .extendConfig('ensOptions', {
    supportedRootNames: ['archanova.ropsten'],
  })
  .extendConfig('ethOptions', {
    networkId: '3',
  })
  .extendConfig('storageOptions', {
    namespace: '@archanova:ropsten',
  });

export const rinkeby = (new Environment(Object.create(mainConfig)))
  .extendConfig('apiOptions', {
    host: 'rinkeby.archanova.run',
  })
  .extendConfig('ensOptions', {
    supportedRootNames: ['archanova.rinkeby'],
  })
  .extendConfig('ethOptions', {
    networkId: '4',
  })
  .extendConfig('storageOptions', {
    namespace: '@archanova:rinkeby',
  });

export const kovan = (new Environment(Object.create(mainConfig)))
  .extendConfig('apiOptions', {
    host: 'kovan.archanova.run',
  })
  .extendConfig('ensOptions', {
    supportedRootNames: ['archanova.kovan'],
  })
  .extendConfig('ethOptions', {
    networkId: '42',
  })
  .extendConfig('storageOptions', {
    namespace: '@archanova:kovan',
  });

export const sokol = (new Environment(Object.create(mainConfig)))
  .extendConfig('apiOptions', {
    host: 'sokol.archanova.run',
  })
  .extendConfig('ensOptions', {
    supportedRootNames: ['archanova.sokol'],
  })
  .extendConfig('ethOptions', {
    networkId: '77',
  })
  .extendConfig('storageOptions', {
    namespace: '@archanova:sokol',
  });

export const xdai = (new Environment(Object.create(mainConfig)))
  .extendConfig('apiOptions', {
    host: 'xdai.archanova.run',
  })
  .extendConfig('ensOptions', {
    supportedRootNames: ['archanova.xdai'],
  })
  .extendConfig('ethOptions', {
    networkId: '100',
  })
  .extendConfig('storageOptions', {
    namespace: '@archanova:xdai',
  });

export const preview = (new Environment(Object.create(mainConfig)))
  .extendConfig('apiOptions', {
    host: 'preview.archanova.run',
  })
  .extendConfig('ensOptions', {
    supportedRootNames: ['archanova.kovan'],
  })
  .extendConfig('ethOptions', {
    networkId: '42',
    contractAddresses: {
      [ContractNames.AccountProvider]: '0x5d7Ba3E503CD2242aDaeF684fc3A80D0c235F73d',
      [ContractNames.AccountProxy]: '0x0fa93F542897a042B6006d022D3319a20fC8C120',
      [ContractNames.AccountFriendRecovery]: '0x214c295eb05c84Fc2c74BC882D179c320CB91064',
      [ContractNames.ENSRegistry]: '0x0c2E30311996Aa263254Cf0C66AC58065C1EeEd3',
      [ContractNames.Guardian]: '0x7fad5f9bEfe389df357A44b56996695BBD25DBe9',
      [ContractNames.VirtualPaymentManager]: '0x9eCAcB74DF0cd63F63C56f9a315AD97C20524AF7',
    },
  })
  .extendConfig('storageOptions', {
    namespace: '@archanova:preview',
  });
