import React from 'react';
import styles from './InputText.module.scss';
import { Button } from './Button';

interface IProps {
  label: string;
  value: string;
  type?: 'text' | 'number';
  decimal?: boolean;
  onChange?: (value: string, valueParsed: any) => any;
  onRandomClick?: () => any;
}

export class InputText extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    type: 'text',
  };

  componentWillMount(): void {
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  public render(): any {
    const { label, value, type, onRandomClick } = this.props;

    return (
      <div className={styles.content}>
        <div>{label}</div>
        <input
          value={value}
          type={type}
          onChange={this.onChangeHandler}
        />
        {!onRandomClick ? null : (
          <Button onClick={onRandomClick}>Random</Button>
        )}
      </div>
    );
  }

  private onChangeHandler(event: React.SyntheticEvent<HTMLInputElement>): void {
    const { onChange, type, decimal } = this.props;

    if (onChange) {
      const { value } = event.currentTarget;
      let valueParsed: any = null;

      switch (type) {
        case 'number':
          if (decimal) {
            valueParsed = parseFloat(value) || 0;
          } else {
            valueParsed = parseInt(value, 10) || 0;
          }
          if (valueParsed < 0) {
            valueParsed = 0;
          }
          break;
        case 'text':
          valueParsed = value;
          break;
      }

      onChange(
        value || '',
        valueParsed,
      );
    }
  }
}
