import React from 'react';
import QrCode from 'qrcode.react';
import { Button } from './Button';
import styles from './Url.module.scss';

interface IProps {
  mobile?: string;
  redirect?: string;
}

export class Url extends React.Component<IProps> {
  public componentWillMount(): void {
    this.clickHandler = this.clickHandler.bind(this);
  }

  public render(): any {
    const { mobile, redirect } = this.props;
    return (
      <div className={styles.content}>
        <div>
          <h5>SCAN USING SMARTSAFE APP</h5>
          <div>
            <QrCode value={mobile} size={250} />
          </div>
        </div>
        {!redirect ? null : (
          <div>
            <Button onClick={this.clickHandler}>Open In Browser</Button>
          </div>
        )}
      </div>
    );
  }

  private clickHandler(): void {
    const { redirect } = this.props;
    document.location = redirect as any;
  }
}
