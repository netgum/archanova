import BN from 'bn.js';
import { abiEncodePacked } from '@netgum/utils';
import { AccountTransaction } from './AccountTransaction';
import { Api } from './Api';
import { Contract } from './Contract';
import { Device } from './Device';
import { State } from './State';

export class AccountVirtualPayment {
  constructor(
    private accountTransaction: AccountTransaction,
    private api: Api,
    private contract: Contract,
    private device: Device,
    private state: State,
  ) {
    //
  }

  public async estimateAccountVirtualDeposit(value: string | number | BN, gasPrice: BN): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    const { virtualPaymentManager } = this.contract;

    return this.accountTransaction.estimateAccountTransaction(
      virtualPaymentManager.address,
      value,
      Buffer.alloc(0),
      gasPrice,
    );
  }

  public async estimateAccountVirtualWithdrawal(amount: string | number | BN, gasPrice: BN): Promise<AccountTransaction.IEstimatedProxyTransaction> {
    const { accountAddress } = this.state;
    const { virtualPaymentManager } = this.contract;

    const {
      id,
      value,
      guardianSignature,
    } = await this.api.sendRequest<{
      id: number;
      value: BN;
      guardianSignature: Buffer;
    }>({
      method: 'POST',
      path: `account/${accountAddress}/withdraw`,
      body: {
        value: amount,
      },
    });

    const message = abiEncodePacked(
      'address',
      'address',
      'address',
      'uint256',
      'uint256',
    )(
      virtualPaymentManager.address,
      accountAddress,
      accountAddress,
      id,
      value,
    );

    const signature = this.device.signPersonalMessage(message);

    const data = virtualPaymentManager.encodeMethodInput(
      'withdrawPayment',
      accountAddress,
      accountAddress,
      id,
      value,
      signature,
      guardianSignature,
    );

    return this.accountTransaction.estimateAccountProxyTransaction(
      data,
      gasPrice,
    );
  }
}
