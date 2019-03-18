import { generateRandomPrivateKey, privateKeyToAddress } from '@netgum/utils';

export function generateRandomAddress() {
  return privateKeyToAddress(
    generateRandomPrivateKey(),
  );
}
