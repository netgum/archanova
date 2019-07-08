import React from 'react';
import { Content, Console, StatusBar, Help, Preloader } from './containers';
import styles from './App.module.scss';

export default class App extends React.Component {

  public render() {
    return (
      <React.Fragment>
        <a href="https://github.com/netgum/archanova">
          <img
            width="149"
            height="149"
            src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
            className={styles.ribbon}
            alt="Fork me on GitHub"
          />
        </a>
        <Content />
        <Console />
        <StatusBar />
        <Help />
        <Preloader />
      </React.Fragment>
    );
  }
}
