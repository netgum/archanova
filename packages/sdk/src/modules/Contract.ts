import { ContractNames, getContractAbi } from '@archanova/contracts';
import EthJs from 'ethjs';
import { encodeMethod, encodeSignature, IAbiItem, TAbi, decodeMethod, IResult } from 'ethjs-abi';
import { Eth } from './Eth';

export class Contract {
  public static createContractInstance<T = string>(abi: TAbi, address: string = null, eth: EthJs = null): Contract.ContractInstance<T> {
    return new Contract.ContractInstance(
      address,
      abi,
      eth,
    );
  }

  public account: Contract.ContractInstance<'addDevice' | 'removeDevice' | 'executeTransaction'>;
  public accountProvider: Contract.ContractInstance;
  public accountProxy: Contract.ContractInstance<'forwardAccountOwnerCall'>;
  public ensRegistry: Contract.ContractInstance;
  public ensResolver: Contract.ContractInstance;
  public virtualPaymentManager: Contract.ContractInstance<'depositPayment' | 'withdrawPayment' | 'withdrawDeposit'>;

  constructor(private eth: Eth) {
    this.account = Contract.createContractInstance(
      getContractAbi(ContractNames.Account),
      null,
      eth,
    );
    this.accountProvider = Contract.createContractInstance(
      getContractAbi(ContractNames.AccountProvider),
      eth.getContractAddress(ContractNames.AccountProvider),
      eth,
    );
    this.accountProxy = Contract.createContractInstance(
      getContractAbi(ContractNames.AccountProxy),
      eth.getContractAddress(ContractNames.AccountProxy),
      eth,
    );
    this.ensRegistry = Contract.createContractInstance(
      getContractAbi(ContractNames.ENSRegistry),
      eth.getContractAddress(ContractNames.ENSRegistry),
      eth,
    );
    this.ensResolver = Contract.createContractInstance(
      getContractAbi(ContractNames.ENSResolver),
      null,
      eth,
    );
    this.virtualPaymentManager = Contract.createContractInstance(
      getContractAbi(ContractNames.VirtualPaymentManager),
      eth.getContractAddress(ContractNames.VirtualPaymentManager),
      eth,
    );
  }
}

export namespace Contract {
  export class ContractInstance<T = string> {
    constructor(
      public address: string,
      public abi: TAbi,
      public eth: EthJs,
    ) {
      //
    }

    public at(address: string): ContractInstance<T> {
      return new ContractInstance(
        address,
        this.abi,
        this.eth,
      );
    }

    public getMethodSignature(method: T): string {
      return encodeSignature(
        this.getAbiItem(method),
      );
    }

    public async callMethod<R = IResult>(method: T, ...args: any[]): Promise<R> {
      const input = this.encodeMethodInput(method, ...args);
      const output = await this.eth.call({
        data: input,
        to: this.address,
      }, 'pending');

      return this.decodeMethodOutput(method, output) as any;
    }

    public encodeMethodInput(method: T, ...args: any[]): string {
      return encodeMethod(
        this.getAbiItem(method),
        args,
      );
    }

    public decodeMethodOutput(method: T, output: string): IResult {
      return decodeMethod(
        this.getAbiItem(method),
        output,
      );
    }

    private getAbiItem(method: T): IAbiItem {
      return this.abi.find(({ name }) => name === (method as any));
    }
  }
}
