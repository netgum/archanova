import React from 'react';
import { Subscription } from 'rxjs';
import { ContextComponent } from '../shared';
import styles from './Preloader.module.scss';

interface IState {
  show: boolean;
}

export default class Preloader extends ContextComponent<{}, IState> {
  public state = {
    show: false,
  };

  private subscription: Subscription = null;

  public componentWillMount(): void {
    this.subscription = this
      .logger
      .pending$
      .subscribe(show => this.setState({ show }));
  }

  public componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  public render() {
    const { show } = this.state;

    return !show ? null : (
      <div className={styles.content}>
        <div className={styles.ring} />
      </div>
    );
  }
}
