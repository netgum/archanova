import React from 'react';
import { sdkModules } from '@archanova/sdk';
import { InputSelect } from './InputSelect';

interface IProps {
  selected: any;
  onChange?: (value: any) => any;
}

export class InputTransactionSpeed extends React.Component<IProps> {
  public static selectedToText(selected: any): string {
    let result: string = null;

    switch (selected) {
      case sdkModules.Eth.TransactionSpeeds.Fast:
        result = 'sdkModules.Eth.TransactionSpeeds.Fast';
        break;
      case sdkModules.Eth.TransactionSpeeds.Slow:
        result = 'sdkModules.Eth.TransactionSpeeds.Slow';
        break;
    }

    return result;
  }

  private static values: string[] = [
    sdkModules.Eth.TransactionSpeeds.Fast,
    sdkModules.Eth.TransactionSpeeds.Regular,
    sdkModules.Eth.TransactionSpeeds.Slow,
  ];

  public render(): any {
    const { selected, onChange } = this.props;

    return (
      <InputSelect
        label="transactionSpeed"
        selected={selected || sdkModules.Eth.TransactionSpeeds.Regular}
        values={InputTransactionSpeed.values}
        onChange={onChange}
      />
    );
  }
}
