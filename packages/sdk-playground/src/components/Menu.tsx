import React from 'react';
import styles from './Menu.module.scss';

interface IProps {
  items: {
    header: string;
    screens: string[];
  }[];
  enabledScreens: { [key: string]: boolean };
  activeScreen: string;
  openScreen: (screen: string) => any;
}

export class Menu extends React.Component<IProps> {
  public render(): any {
    const { items, activeScreen, enabledScreens } = this.props;

    return (
      <div className={styles.content}>
        <div className={styles.wrapper}>
          {items.map(({ screens, header }, index) => (
            <div key={`${index}`}>
              <h4>{header.toUpperCase()}</h4>
              <div>
                {screens.map((screen, subIndex) => {
                  const classNames: string[] = [];
                  if (activeScreen === screen) {
                    classNames.push(styles.active);
                  }
                  if (!enabledScreens[screen]) {
                    classNames.push(styles.off);
                  }
                  return (
                    <button
                      key={`${index}_${subIndex}`}
                      onClick={this.createOnClickHandler(screen)}
                      title={screen}
                      className={classNames.join(' ')}
                    >
                      {screen}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  private createOnClickHandler(screen: string): () => any {
    const { openScreen } = this.props;

    return () => openScreen(screen);
  }
}
