import { availableEnvironments, createSdk } from '@archanova/wallet-sdk';

const {
  REACT_APP_SDK_API_HOST,
  REACT_APP_SDK_API_PORT,
  REACT_APP_SDK_API_USE_SSL,
  REACT_APP_SDK_ETH_PROVIDER_ENDPOINT,
  REACT_APP_SDK_AUTO_INITIALIZE,
  REACT_APP_SDK_AUTO_ACCEPT_ACTION,
} = process.env;

let environment = availableEnvironments
  .staging
  .extendOptions('action', {
    autoAccept: !!REACT_APP_SDK_AUTO_ACCEPT_ACTION,
  })
  .extendOptions('url', {
    listener: (callback) => callback(document.location.toString()),
    opener: (url) => document.location = url,
  })
  .extendOptions('storage', {
    namespace: '@tutorial',
    adapter: localStorage,
  });

// sdk env customizations for local development
if (REACT_APP_SDK_API_HOST) {

  environment = environment
    .extendOptions('api', {
      host: REACT_APP_SDK_API_HOST,
      port: parseInt(REACT_APP_SDK_API_PORT, 10),
      useSsl: !!REACT_APP_SDK_API_USE_SSL,
    })
    .extendOptions('eth', {
      providerEndpoint: REACT_APP_SDK_ETH_PROVIDER_ENDPOINT,
    });
}

// creates sdk instance
export const sdk = new createSdk(environment);

if (REACT_APP_SDK_AUTO_INITIALIZE) {
  sdk.initialize().catch(console.error);
}
