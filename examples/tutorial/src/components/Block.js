import React, { Component } from 'react';
import * as styles from './Block.css';

export class Block extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.block}>
        {children}
      </div>
    );
  }
}
