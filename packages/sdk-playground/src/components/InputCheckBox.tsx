import React from 'react';
import styles from './InputCheckBox.module.scss';

interface IProps {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => any;
}

export class InputCheckBox extends React.Component<IProps> {

  componentWillMount(): void {
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  public render(): any {
    const { label, checked } = this.props;

    return (
      <div className={styles.content}>
        <label>
          <input
            checked={checked}
            type="checkbox"
            onChange={this.onChangeHandler}
          />
          <span>{label}</span>
        </label>
      </div>
    );
  }

  private onChangeHandler(event: React.SyntheticEvent<HTMLInputElement>): void {
    const { onChange } = this.props;

    if (onChange) {
      const { checked } = event.currentTarget;
      onChange(checked);
    }
  }
}
