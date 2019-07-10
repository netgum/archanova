import React from 'react';
import styles from './MenuOption.module.scss';

interface IProps {
  checked: boolean;
  onToggle: () => any;
  children: string;
}

export class MenuOption extends React.Component<IProps> {
  public render() {
    const { checked, onToggle, children } = this.props;
    return (
      <div>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
          />
          <span className={styles.overlay}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.icon}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          {children.toUpperCase()}
        </label>
      </div>
    );
  }
}
