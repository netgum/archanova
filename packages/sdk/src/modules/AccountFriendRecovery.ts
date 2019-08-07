import { abiEncodePacked, anyToHex, recoverAddressFromPersonalMessage } from '@netgum/utils';
import BN from 'bn.js';
import { AccountDeviceStates, AccountDeviceTypes } from '../constants';
import { ApiMethods } from './ApiMethods';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountFriendRecovery {
  constructor(
    private apiMethods: ApiMethods,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public async signAccountFriendRecovery(accountAddress: string, deviceAddress: string, gasPrice: BN): Promise<string> {
    let result: string = null;

    const { accountAddress: friend } = this.state;
    const { friends, nonce, gasFee } = await this.apiMethods.getAccountFriendRecovery(accountAddress);

    if (friends.indexOf(friend) !== -1) {
      const { accountFriendRecovery } = this.contract;

      const message = abiEncodePacked(
        'address',
        'bytes',
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
      )(
        accountFriendRecovery.address,
        accountFriendRecovery.getMethodSignature('recoverAccount'),
        accountAddress,
        deviceAddress,
        nonce,
        gasFee,
        gasPrice,
      );

      result = anyToHex(this.device.signPersonalMessage(message), { add0x: true });
    }

    return result;
  }

  public async collectAccountFriendSignature(friendAddress: string, friendSignature: string): Promise<boolean> {
    let result = false;

    const { deviceAddress, accountFriendRecovery } = this.state;
    const { accountAddress, friends, nonce, gasFee, gasPrice, friendSignatures } = accountFriendRecovery;
    if (friends.indexOf(friendAddress) !== -1) {
      const { accountFriendRecovery } = this.contract;

      const message = abiEncodePacked(
        'address',
        'bytes',
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
      )(
        accountFriendRecovery.address,
        accountFriendRecovery.getMethodSignature('recoverAccount'),
        accountAddress,
        deviceAddress,
        nonce,
        gasFee,
        gasPrice,
      );

      const friendDevice = recoverAddressFromPersonalMessage(message, friendSignature);

      const { state, type } = await this.apiMethods.getAccountDevice(friendAddress, friendDevice);

      result = (
        state === AccountDeviceStates.Deployed &&
        type === AccountDeviceTypes.Owner
      );
    }

    if (result) {
      accountFriendRecovery.friendSignatures = {
        ...friendSignatures,
        [friendAddress]: friendSignature,
      };

      this.state.accountFriendRecovery$.next({
        ...accountFriendRecovery,
      });
    }

    return result;
  }

  public async startAccountFriendRecovery(accountAddress: string): Promise<void> {
    const accountFriendRecovery = await this.apiMethods.getAccountFriendRecovery(accountAddress);

    this.state.accountFriendRecovery$.next({
      accountAddress,
      friendSignatures: {},
      ...accountFriendRecovery,
    });
  }

  public async cancelAccountFriendRecovery(): Promise<void> {
    this.state.accountFriendRecovery$.next(null);
  }

  public async submitAccountFriendRecovery(): Promise<string> {
    const { accountFriendRecovery: { accountAddress, gasPrice, friendSignatures, guardianSignature } } = this.state;

    const friends: string[] = [];
    const signatures: string[] = [];

    Object
      .entries(friendSignatures)
      .forEach(([friend, signature]) => {
        friends.push(friend);
        signatures.push(signature);
      });

    const hash = await this.apiMethods.submitAccountFriendRecovery(
      accountAddress,
      friends,
      signatures,
      gasPrice,
      guardianSignature,
    );

    if (hash) {
      this.state.accountFriendRecovery$.next(null);
    }

    return hash;
  }
}
