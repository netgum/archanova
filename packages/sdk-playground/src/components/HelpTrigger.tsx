import React from 'react';
import { ContextComponent } from '../shared';
import styles from './HelpTrigger.module.scss';

interface IProps {
  alias?: string;
  className?: string;
}

export class HelpTrigger extends ContextComponent<IProps> {
  public componentWillMount(): void {
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  public render(): any {
    const { className, children } = this.props;
    return (
      <div
        className={`${styles.content} ${className}`}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {children}
      </div>
    );
  }

  private onMouseEnter(): void {
    const { alias } = this.props;

    if (alias && this.help) {
      this.help.show(alias);
    }
  }

  private onMouseLeave(): void {
    const { alias } = this.props;

    if (alias && this.help) {
      this.help.hide();
    }
  }
}
