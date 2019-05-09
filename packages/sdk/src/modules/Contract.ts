import { ContractNames, getContractAbi } from '@archanova/contracts';
import { encodeMethod, encodeSignature, IAbiItem, TAbi } from 'ethjs-abi';
import { Eth } from './Eth';

export class Contract {
  public static createContract<T = string>(abi: TAbi, address: string = null): Contract.ContractInstance<T> {
    return new Contract.ContractInstance(
      address,
      abi,
    );
  }

  public account: Contract.ContractInstance<'addDevice' | 'removeDevice' | 'executeTransaction'>;
  public accountProvider: Contract.ContractInstance;
  public accountProxy: Contract.ContractInstance<'forwardAccountOwnerCall'>;
  public ensRegistry: Contract.ContractInstance;
  public ensResolver: Contract.ContractInstance;
  public virtualPaymentManager: Contract.ContractInstance<'depositPayment' | 'withdrawPayment' | 'withdrawDeposit'>;

  constructor(private eth: Eth) {
    this.account = Contract.createContract(
      getContractAbi(ContractNames.Account),
    );
    this.accountProvider = Contract.createContract(
      getContractAbi(ContractNames.AccountProvider),
      eth.getContractAddress(ContractNames.AccountProvider),
    );
    this.accountProxy = Contract.createContract(
      getContractAbi(ContractNames.AccountProxy),
      eth.getContractAddress(ContractNames.AccountProxy),
    );
    this.ensRegistry = Contract.createContract(
      getContractAbi(ContractNames.ENSRegistry),
      eth.getContractAddress(ContractNames.ENSRegistry),
    );
    this.ensResolver = Contract.createContract(
      getContractAbi(ContractNames.ENSResolver),
    );
    this.virtualPaymentManager = Contract.createContract(
      getContractAbi(ContractNames.VirtualPaymentManager),
      eth.getContractAddress(ContractNames.VirtualPaymentManager),
    );
  }
}

export namespace Contract {
  export class ContractInstance<T = string> {
    constructor(
      public address: string,
      public abi: TAbi,
    ) {
      //
    }

    public getSignature(method: T): string {
      return encodeSignature(
        this.getAbiItem(method),
      );
    }

    public getDate(method: T, ...args: any[]): string {
      return encodeMethod(
        this.getAbiItem(method),
        args,
      );
    }

    private getAbiItem(method: T): IAbiItem {
      return this.abi.find(({ name }) => name === (method as any));
    }
  }
}
