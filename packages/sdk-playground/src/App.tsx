import React from 'react';
import { Header, Content } from './containers';

export default class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Header />
        <Content />
      </React.Fragment>
    );
  }
}
