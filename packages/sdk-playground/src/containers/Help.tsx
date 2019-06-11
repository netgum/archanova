import React from 'react';
import { Subscription } from 'rxjs';
import MarkdownIt from 'markdown-it';
import { ContextComponent } from '../shared';
import styles from './Help.module.scss';
import help from '../help';

interface IState {
  alias: string;
}

export default class Help extends ContextComponent<{}, IState> {
  public state = {
    alias: null,
  };

  private markdownIt: MarkdownIt = null;
  private subscription: Subscription = null;

  public componentWillMount(): void {
    this.markdownIt = new MarkdownIt();
    this.subscription = this
      .help
      .stream$
      .subscribe(alias => this.setState({
        alias,
      }));

  }

  public componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  public render() {
    const { alias } = this.state;

    if (!parseInt(process.env.REACT_APP_SHOW_HELP, 10) || !alias || !help[alias] ) {
      return null;
    }

    const html = this.markdownIt.render(help[alias].trim());

    return (
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}
