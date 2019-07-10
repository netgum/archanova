import React from 'react';
import { Subscription } from 'rxjs';
import { ContextComponent } from '../shared';
import help from '../help';
import styles from './HelpTrigger.module.scss';

interface IProps {
  alias?: string;
  className?: string;
}

interface IState {
  visible: boolean;
}

export class HelpTrigger extends ContextComponent<IProps, IState> {
  public state: IState = {
    visible: false,
  };

  private subscriptions: Subscription[] = [];

  public componentWillMount(): void {
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.subscriptions = [
      this
        .config
        .showHelp$
        .subscribe(visible => this.setState({
          visible,
        })),
    ];
    this.setState({
      visible: this.context.config.showHelp,
    });
  }

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public render(): any {
    const { alias, className, children } = this.props;
    const { visible } = this.state;
    if (
      !visible ||
      !this.prefix ||
      !help[alias]
    ) {
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
