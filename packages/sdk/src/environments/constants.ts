import { Environment } from '../modules';

export enum SdkEnvironmentNames {
  // Main = 'main',
  Kovan = 'kovan',
  Rinkeby = 'rinkeby',
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
