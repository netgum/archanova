import React from 'react';
import styles from './Button.module.scss';

interface IProps {
  onClick?: () => any;
  disabled?: boolean;
}

export class Button extends React.Component<IProps> {
  public render(): any {
    const { children, disabled, onClick } = this.props;
    return (
      <button
        className={styles.content}
        disabled={disabled || !onClick}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}
