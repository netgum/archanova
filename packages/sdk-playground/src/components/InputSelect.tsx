import React from 'react';
import styles from './InputSelect.module.scss';

interface IProps {
  label: string;
  selected: string;
  values: string[];
  onChange?: (value: any) => any;
}

export class InputSelect extends React.Component<IProps> {
  componentWillMount(): void {
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  public render(): any {
    const { label, values, selected } = this.props;

    return (
      <div className={styles.content}>
        <div>{label}</div>
        <select
          onChange={this.onChangeHandler}
          value={selected}
        >
          {values.map(value => (
            <option
              key={`${value}`}
              value={value}
            >
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  private onChangeHandler(event: React.SyntheticEvent<HTMLSelectElement>): void {
    const { onChange, values } = this.props;
    if (onChange) {
      const { selectedIndex } = event.currentTarget;
      if (values[selectedIndex]) {
        onChange(values[selectedIndex]);
      }
    }
  }
}
