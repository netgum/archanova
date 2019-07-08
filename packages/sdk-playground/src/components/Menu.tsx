import React from 'react';
import { Subscription } from 'rxjs';
import styles from './Menu.module.scss';
import { ContextComponent, isFeatureActive } from '../shared';
import { HelpTrigger } from './HelpTrigger';

interface IProps {
  items: {
    header: string;
    alwaysOpen?: boolean;
    screens: string[];
  }[];
  enabledScreens: { [key: string]: boolean };
  activeScreen: string;
  openScreen: (screen: string) => any;
}

interface IState {
  showHelps: boolean;
  activeIndex: number;
}

export class Menu extends ContextComponent<IProps, IState> {
  public state: IState = {
    showHelps: true,
    activeIndex: -1,
  };

  private subscriptions: Subscription[] = [];

  public componentWillMount(): void {
    this.subscriptions = [
      this
        .help
        .active$
        .subscribe(showHelps => this.setState({
          showHelps,
        })),
    ];

    this.setState({
      showHelps: this.context.help.active$.value,
    });
  }

  public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    this.setState({
      activeIndex: -1,
    });
  }

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public render(): any {
    const { items, activeScreen, enabledScreens } = this.props;
    const { showHelps, activeIndex } = this.state;

    return (
      <div className={styles.content}>
        <div className={styles.wrapper}>
          {items.map(({ screens, header, alwaysOpen }, index) => {
            const isOpen = alwaysOpen || activeIndex === index || !!screens.find(screen => activeScreen === screen);
            return (
              <div key={`${index}`}>
                <h4 onClick={this.createOpenSection(index)}>{header.toUpperCase()}</h4>
                {!isOpen ? null : (
                  <div>
                    {screens.map((screen, subIndex) => {
                      const classNames: string[] = [];
                      if (activeScreen === screen) {
                        classNames.push(styles.active);
                      }
                      if (!enabledScreens[screen]) {
                        classNames.push(styles.off);
                      }

                      const helpAlias = screen
                        .replace(/([ -][a-z])/ig, found => found.replace('-', '').trim().toUpperCase());

                      return (
                        <HelpTrigger
                          key={`${index}_${subIndex}`}
                          alias={`menu.${helpAlias}`}
                        >
                          <button
                            onClick={this.createOnClickHandler(screen)}
                            title={screen}
                            className={classNames.join(' ')}
                          >
                            {screen}
                          </button>
                        </HelpTrigger>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {!isFeatureActive('help') ? null : (
            <div className={styles.options}>
              <h4>OPTIONS</h4>
              <div>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={showHelps}
                    onClick={this.help.toggle}
                  />
                  <span className={styles.overlay}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.icon}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  SHOW HELP MESSAGES
                </label>
              </div>
            </div>
          )}
        </div>
        <footer>
          Copyright © 2019 <a href="https://netgum.io">NetGum</a>
        </footer>
      </div>
    );
  }

  private createOnClickHandler(screen: string): () => any {
    const { openScreen } = this.props;

    return () => openScreen(screen);
  }

  private createOpenSection(index: number): () => void {
    return () => {
      this.setState({
        activeIndex: index,
      });
    };
  }
}
