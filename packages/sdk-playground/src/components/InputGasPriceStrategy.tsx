import React from 'react';
import { sdkConstants } from '@archanova/sdk';
import { InputSelect } from './InputSelect';

interface IProps {
  selected: any;
  onChange?: (value: any) => any;
}

export class InputGasPriceStrategy extends React.Component<IProps> {
  public static selectedToText(selected: any): string {
    let result: string = null;

    if (selected === sdkConstants.GasPriceStrategies.Fast) {
      result = 'sdkConstants.GasPriceStrategies.Fast';
    }

    return result;
  }

  private static values: string[] = [
    sdkConstants.GasPriceStrategies.Avg,
    sdkConstants.GasPriceStrategies.Fast,
  ];

  public render(): any {
    const { selected, onChange } = this.props;

    return (
      <InputSelect
        label="gasPriceStrategy"
        selected={selected || sdkConstants.GasPriceStrategies.Avg}
        values={InputGasPriceStrategy.values}
        onChange={onChange}
      />
    );
  }
}
