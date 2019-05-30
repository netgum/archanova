import React from 'react';
import { Button } from './Button';
import { Code } from './Code';
import styles from './Example.module.scss';

interface IProps {
  title?: string;
  code: string;
  enabled: boolean;
  run: () => any;
}

export class Example extends React.Component<IProps> {

  public render(): any {
    const { title, code, run, enabled, children } = this.props;
    return (
      <div className={styles.content}>
        {!title ? null : (
          <h3>{title}</h3>
        )}
        {children ? (
          <React.Fragment>
            <h5>PARAMETERS</h5>
            <div>
              {children}
            </div>
          </React.Fragment>
        ) : null}
        <h5>CODE</h5>
        <div>
          <Code language="javascript">
            {code}
          </Code>
          <Button onClick={run} disabled={!enabled}>Run</Button>
        </div>
      </div>
    );
  }
}
