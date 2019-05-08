import React from 'react';
import { QrCode } from './components';

export class App extends React.Component {
  public render(): any {
    return (
      <QrCode url="http://www.google.com" small={true} />
    );
  }
}
