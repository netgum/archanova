import BN from 'bn.js';
import { createLocalSdkEnvironment, getSdkEnvironment, SdkEnvironmentNames, sdkModules } from '@archanova/sdk';
import { anyToHex, generateRandomPrivateKey, privateKeyToAddress, weiToEth } from '@netgum/utils';
import { config } from '../config';

export function buildSdkEnv(name: string): sdkModules.Environment {
  let result: sdkModules.Environment;

  if (name === 'local') {
    result = createLocalSdkEnvironment({
      port: config.localSdkEnvPort,
    });
  } else {
    result = getSdkEnvironment(name as SdkEnvironmentNames);
  }

  return result
    .setConfig('storageAdapter', localStorage as sdkModules.Storage.IAdapter)
    .setConfig('urlAdapter', {
      open(url: string): any {
        document.location = url as any;
      },
      addListener(listener: (url: string) => any): void {
        listener(document.location.toString());
      },
    })
    .extendConfig('actionOptions', {
      autoAccept: config.autoAcceptSdkActions,
    });
}

export function generateRandomAddress() {
  return privateKeyToAddress(
    generateRandomPrivateKey(),
  );
}

export function generateRandomEnsLabel() {
  const hash1 = Date.now().toString(32);
  const hash2 = Math.floor(Math.random() * 100000).toString(32);
  return (
    `playground${hash1}${hash2}`
  );
}

export function getCurrentEndpoint() {
  return document.location.origin;
}

export function formatBalance(balance: BN): string {
  return balance
    ? `${weiToEth(balance).toFixed(6)} ETH`
    : '-';
}

export function mergeMethodArgs(...args: any[]): string {
  return args
    .filter(arg => !!arg)
    .map(arg => `${arg}`)
    .join(', ');
}

function jsonReplacer(key: string, value: any): any {
  const data = this[key];

  if (
    Buffer.isBuffer(data) ||
    BN.isBN(data)
  ) {
    const hash = anyToHex(data, {
      add0x: true,
    });
    const label = Buffer.isBuffer(data) ? 'Buffer' : 'BN';

    value = `${label}: ${hash}`;
  }

  return value;
}

export function toRawObject(data: any): any {
  return JSON.parse(
    JSON.stringify(data, jsonReplacer),
  );
}
