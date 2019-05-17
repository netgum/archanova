import BN from 'bn.js';
import { anyToHex, generateRandomPrivateKey, privateKeyToAddress, weiToEth } from '@netgum/utils';

export function generateRandomAddress() {
  return privateKeyToAddress(
    generateRandomPrivateKey(),
  );
}

export function generateRandomEnsLabel() {
  const hash1 = Date.now().toString(32);
  const hash2 = Math.floor(Math.random() * 100000).toString(32);
  return (
    `tutorial${hash1}${hash2}`
  );
}

export function getLocationPort() {
  return parseInt(document.location.port, 10);
}

export function getTargetEndpoint() {
  const port = getLocationPort();
  return `http://localhost:${port === 5100 ? 5200 : 5100}`;
}

export function getCurrentEndpoint() {
  const port = getLocationPort();
  return `http://localhost:${port}`;
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
    value = anyToHex(data, {
      add0x: true,
    });
  }

  return value;
}

export function toRawObject(data: any): any {
  return JSON.parse(
    JSON.stringify(data, jsonReplacer),
  );
}
