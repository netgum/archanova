import React from 'react';
import styles from './Screen.module.scss';
import { ContextComponent } from '../shared';

interface IProps {
  enabled: boolean;
}

export abstract class Screen<S = any> extends ContextComponent<IProps, S> {
  public render(): any {
    const content = this.renderContent();
    return (
      <div className={styles.content}>
        {content}
      </div>
    );
  }

  public abstract renderContent(): any;
}
