import React from 'react';
import { Header, Content, Footer } from './containers';

export default class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Header />
        <Content />
        <Footer />
      </React.Fragment>
    );
  }
}
