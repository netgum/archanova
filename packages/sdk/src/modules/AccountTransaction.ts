import { abiEncodePacked } from '@netgum/utils';
import { IEstimatedAccountProxyTransaction } from '../interfaces';
import { ApiMethods } from './ApiMethods';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountTransaction {
  constructor(
    private apiMethods: ApiMethods,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public async submitAccountProxyTransaction({ nonce, data, fixedGas, gasPrice, guardianSignature }: IEstimatedAccountProxyTransaction): Promise<string> {
    const { accountAddress } = this.state;
    const { accountProxy } = this.contract;

    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      accountProxy.address,
      accountProxy.getMethodSignature('forwardAccountOwnerCall'),
      accountAddress,
      nonce,
      data.map((value, index) => index ? value.substr(2) : value).join(''),
      fixedGas,
      gasPrice,
    );

    const signature = this.device.signPersonalMessage(message);

    return this.apiMethods.submitAccountProxyTransaction(accountAddress, data, signature, gasPrice, guardianSignature);
  }
}
