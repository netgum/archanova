import { Environment } from '../modules';

export enum SdkEnvironmentNames {
  // Main = 'main',
  Ropsten = 'ropsten',
  Rinkeby = 'rinkeby',
  Kovan = 'kovan',
  Sokol = 'sokol',
}

const mainConfig: Environment.IConfigs = {
  apiOptions: {
    host: 'main.archanova.run',
    ssl: true,
    reconnectTimeout: 3000,
  },
  ensOptions: {
    supportedRootNames: ['archanova.eth'],
  },
  ethOptions: {
    networkId: '1',
    gasPrice: '0x77359400',
  },
  apiWebSocketConstructor: null,
  storageOptions: {
    namespace: '@archanova:main',
  },
  storageAdapter: null,
};

export const main = new Environment(Object.create(mainConfig));

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
