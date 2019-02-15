import { IBN } from 'bn.js';
import { abiEncodePacked, getMethodSignature } from '@netgum/utils';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../constants';
import { PlatformService } from '../platform';
import { IAccountService } from '../account';
import { IDeviceService } from '../device';
import { IEthService } from '../eth';
import { IAccountProxyService } from './interfaces';

@injectable()
export class AccountProxyService extends PlatformService implements IAccountProxyService {
  public static TYPES = {
    Options: Symbol('AccountProxyService:Options'),
  };

  constructor(
    @inject(AccountProxyService.TYPES.Options) private options: IAccountProxyService.IOptions,
    @inject(TYPES.AccountService) private accountService: IAccountService,
    @inject(TYPES.DeviceService) private deviceService: IDeviceService,
    @inject(TYPES.EthService) private ethService: IEthService,
  ) {
    super(options);
  }

  public async estimateTransaction(to: string, value: IBN, data: Buffer = null): Promise<IAccountProxyService.IEstimatedTransaction> {
    let result: IAccountProxyService.IEstimatedTransaction = null;

    try {
      const gasPrice = await this.ethService.getGasPrice();

      const response = await this.sendEstimateTransaction(
        this.options.contractAddress,
        this.accountService.account.address, {
          gasPrice,
          to,
          value,
          data: data || Buffer.alloc(0),
        },
      );

      result = {
        gasPrice,
        ...response,
      };
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async estimateDeployDevice(deviceAddress: string): Promise<IAccountProxyService.IEstimatedTransaction> {
    let result: IAccountProxyService.IEstimatedTransaction = null;

    try {
      const gasPrice = await this.ethService.getGasPrice();

      const response = await this.sendEstimateDeployDevice(
        this.options.contractAddress,
        this.accountService.account.address,
        deviceAddress,
        gasPrice,
      );

      result = {
        gasPrice,
        ...response,
      };
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async executeTransaction(estimated: IAccountProxyService.IEstimatedTransaction): Promise<string> {
    let result: string = null;

    const { nonce, data, fixedGas, gasPrice } = estimated;

    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      this.options.contractAddress,
      getMethodSignature('forwardAccountOwnerCall', 'address', 'uint256', 'bytes', 'uint256', 'bytes'),
      this.accountService.account.address,
      nonce,
      data,
      fixedGas,
      gasPrice,
    );

    const signature = await this.deviceService.signPersonalMessage(message);

    try {
      result = await this.sendExecuteTransaction(
        this.options.contractAddress,
        this.accountService.account.address, {
          data,
          gasPrice,
          nonce,
          signature,
        },
      );
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async deployDevice(deviceAddress: string, estimated: IAccountProxyService.IEstimatedTransaction): Promise<string> {
    let result: string = null;

    const { nonce, data, fixedGas, gasPrice } = estimated;

    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      this.options.contractAddress,
      getMethodSignature('forwardAccountOwnerCall', 'address', 'uint256', 'bytes', 'uint256', 'bytes'),
      this.accountService.account.address,
      nonce,
      data,
      fixedGas,
      gasPrice,
    );

    const signature = await this.deviceService.signPersonalMessage(message);

    try {
      result = await this.sendDeployDevice(
        this.options.contractAddress,
        this.accountService.account.address,
        deviceAddress, {
          data,
          gasPrice,
          nonce,
          signature,
        },
      );
    } catch (err) {
      result = null;
    }

    return result;
  }

  private sendEstimateTransaction(
    accountProviderAddress: string,
    accountAddress: string,
    body: IAccountProxyService.ISendEstimateTransactionBody,
  ): Promise<IAccountProxyService.ISendEstimateTransactionResponse> {
    return this.sendHttpRequest<IAccountProxyService.ISendEstimateTransactionResponse>({
      body,
      path: `${accountProviderAddress}/account/${accountAddress}/transaction`,
      method: 'POST',
    });
  }

  private async sendExecuteTransaction(
    accountProviderAddress: string,
    accountAddress: string,
    body: IAccountProxyService.ISendExecuteTransactionBody,
  ): Promise<string> {
    const { hash } = await this.sendHttpRequest<{
      hash: string;
    }>({
      body,
      path: `${accountProviderAddress}/account/${accountAddress}/transaction`,
      method: 'PUT',
    });

    return hash;
  }

  private sendEstimateDeployDevice(
    accountProviderAddress: string,
    accountAddress: string,
    deviceAddress: string,
    gasPrice: IBN,
  ): Promise<IAccountProxyService.ISendEstimateTransactionResponse> {
    return this.sendHttpRequest<IAccountProxyService.ISendEstimateTransactionResponse>({
      path: `${accountProviderAddress}/account/${accountAddress}/device/${deviceAddress}`,
      method: 'POST',
      body: { gasPrice },
    });
  }

  private async sendDeployDevice(
    accountProviderAddress: string,
    accountAddress: string,
    deviceAddress: string,
    body: IAccountProxyService.ISendExecuteTransactionBody,
  ): Promise<string> {
    const { hash } = await this.sendHttpRequest<{
      hash: string;
    }>({
      body,
      path: `${accountProviderAddress}/account/${accountAddress}/device/${deviceAddress}`,
      method: 'PUT',
    });

    return hash;
  }
}
