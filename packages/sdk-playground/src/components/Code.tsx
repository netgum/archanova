import 'highlight.js/styles/a11y-light.css';
import 'highlight.js/lib/languages/javascript';
import 'highlight.js/lib/languages/json';

import React from 'react';
import Highlight from 'react-highlight';
import styles from './Code.module.scss';

interface IProps {
  language: 'javascript' | 'json';
  children: string;
}

export class Code extends React.Component<IProps> {
  public render(): any {
    const { language, children } = this.props;

    let empty = false;
    const code = children
      .trim()
      .split('\n')
      .filter((line) => {
        let result = true;
        if (!line.trim()) {
          if (empty) {
            result = false;
          } else {
            empty = true;
          }
        } else {
          empty = false;
        }
        return result;
      })
      .join('\n');

    return (
      <div className={styles.content}>
        <Highlight language={language}>
          {code}
        </Highlight>
      </div>
    );
  }
}
