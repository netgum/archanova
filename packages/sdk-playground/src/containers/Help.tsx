import React from 'react';
import { Subscription } from 'rxjs';
import MarkdownIt from 'markdown-it';
import { ContextComponent } from '../shared';
import styles from './Help.module.scss';
import help from '../help';

interface IState {
  alias: string;
  visible: boolean;
}

export default class Help extends ContextComponent<{}, IState> {
  public state = {
    alias: null,
    visible: false,
  };

  private markdownIt: MarkdownIt = null;
  private subscriptions: Subscription[] = [];

  public componentWillMount(): void {
    this.markdownIt = new MarkdownIt();
    this.subscriptions = [
      this
        .help
        .active$
        .subscribe(visible => this.setState({
          visible,
        })),
      this
        .help
        .stream$
        .subscribe(alias => this.setState({
          alias,
        })),
    ];
    this.setState({
      visible: this.context.help.active$.value,
    });
  }

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public render() {
    const { alias, visible } = this.state;

    if (
      !visible ||
      !alias ||
      !help[alias]
    ) {
      return null;
    }

    const classNames: string[] = [
      styles.content,
    ];

    switch (this.prefix) {
      case 'menu':
        classNames.push(styles.menu);
        break;
      case 'statusBar':
        classNames.push(styles.statusBar);
        break;
    }

    const html = this.markdownIt.render(help[alias].trim());

    return (
      <div
        className={classNames.join(' ')}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  private get prefix(): string {
    const { alias } = this.state;

    return alias
      ? alias.split('.')[0]
      : null;
  }
}
