import React from 'react';
import { Content, Console, StatusBar, Help } from './containers';

export default class App extends React.Component {

  public render() {
    return (
      <React.Fragment>
        <Content />
        <Console />
        <StatusBar />
        <Help />
      </React.Fragment>
    );
  }
}
