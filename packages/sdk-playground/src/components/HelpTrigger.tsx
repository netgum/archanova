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
    if (!this.prefix) {
      return (
        <div>
          {children}
        </div>
      );
    }

    const classNames = [
      styles.content,
      className,
    ];

    switch (this.prefix) {
      case 'menu':
        classNames.push(styles.menu);
        break;

      case 'statusBar':
        classNames.push(styles.statusBar);
        break;
    }

    return (
      <div
        className={classNames.join(' ')}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div className={styles.dot} />
        {children}
      </div>
    );
  }

  private get prefix(): string {
    const { alias } = this.props;

    return alias
      ? alias.split('.')[0]
      : null;
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
