import { IBN } from 'bn.js';
import { abiEncodePacked, getMethodSignature } from '@netgum/utils';
import { IApiService } from '../api';
import { IDeviceService } from '../device';
import { IAccountProxyService } from './interfaces';

export class AccountProxyService implements IAccountProxyService {
  constructor(
    private options: IAccountProxyService.IOptions,
    private apiService: IApiService,
    private deviceService: IDeviceService,
  ) {
    //
  }

  public async estimateTransaction(
    accountAddress: string,
    to: string,
    value: IBN,
    data: Buffer,
    gasPrice: IBN,
  ): Promise<IAccountProxyService.IEstimatedTransaction> {
    let result: IAccountProxyService.IEstimatedTransaction = null;

    try {
      const { contractAddress } = this.options;

      result = await this.apiService.sendHttpRequest<IAccountProxyService.IEstimatedTransaction>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/transaction`,
        method: 'POST',
        body: {
          to,
          value,
          data,
          gasPrice,
        },
      });
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async estimateDeployDevice(accountAddress: string, deviceAddress: string, gasPrice: IBN): Promise<IAccountProxyService.IEstimatedTransaction> {
    let result: IAccountProxyService.IEstimatedTransaction = null;

    try {
      const { contractAddress } = this.options;

      result = await this.apiService.sendHttpRequest<IAccountProxyService.IEstimatedTransaction>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/device/${deviceAddress}`,
        method: 'POST',
        body: {
          gasPrice,
        },
      });
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async executeTransaction(accountAddress: string, estimated: IAccountProxyService.IEstimatedTransaction, gasPrice: IBN): Promise<string> {
    let result: string = null;

    const { contractAddress } = this.options;
    const { nonce, data, fixedGas } = estimated;

    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      contractAddress,
      getMethodSignature('forwardAccountOwnerCall', 'address', 'uint256', 'bytes', 'uint256', 'bytes'),
      accountAddress,
      nonce,
      data,
      fixedGas,
      gasPrice,
    );

    const signature = await this.deviceService.signPersonalMessage(message);

    try {
      const { hash } = await this.apiService.sendHttpRequest<{
        hash: string;
      }>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/transaction`,
        method: 'PUT',
        body: {
          data,
          gasPrice,
          nonce,
          signature,
        },
      });

      result = hash;
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async deployDevice(
    accountAddress: string,
    deviceAddress: string,
    estimated: IAccountProxyService.IEstimatedTransaction,
    gasPrice: IBN,
  ): Promise<string> {
    let result: string = null;

    const { contractAddress } = this.options;
    const { nonce, data, fixedGas } = estimated;

    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      contractAddress,
      getMethodSignature('forwardAccountOwnerCall', 'address', 'uint256', 'bytes', 'uint256', 'bytes'),
      accountAddress,
      nonce,
      data,
      fixedGas,
      gasPrice,
    );

    const signature = await this.deviceService.signPersonalMessage(message);

    try {
      const { hash } = await this.apiService.sendHttpRequest<{
        hash: string;
      }>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/device/${deviceAddress}`,
        method: 'PUT',
        body: {
          data,
          gasPrice,
          nonce,
          signature,
        },
      });

      result = hash;
    } catch (err) {
      result = null;
    }

    return result;
  }
}
