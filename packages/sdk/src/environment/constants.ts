import { Environment } from './Environment';

export const availableEnvironments = {
  staging: new Environment({
    accountProvider: {
      contractAddress: '0x13266E4C16c279741f3cF0d9FE90D2d36B3669a2',
    },
    accountProxy: {
      contractAddress: '0xc9FE248E38a2F0Ac114932ecFF4B1bAc74E90b91',
    },
    action: {},
    api: {
      host: 'api.staging.archanova.run',
      port: null,
      useSsl: true,
      reconnectTimeout: 3000,
    },
    eth: {
      providerEndpoint: 'https://parity.staging.archanova.run/',
    },
    url: {},
    storage: {},
  }),
};
