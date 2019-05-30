import React from 'react';
import { connect } from 'react-redux';
import { Subscription, from, Subject } from 'rxjs';
import { ISdkReduxState, Sdk } from '@archanova/sdk';
import { filter, switchMap, map } from 'rxjs/operators';
import { ObjectInspector } from 'react-inspector';
import { ContextComponent, ILoggerEvent, toRawObject } from '../shared';
import styles from './Footer.module.scss';

interface IState {
  tab: number;
  loggerEvents: (ILoggerEvent & { id: number })[];
  sdkEvents: (Sdk.IEvent & { id: number })[];
}

interface IProps {
  sdk: ISdkReduxState;
}

class Footer extends ContextComponent<IProps, IState> {
  public state = {
    tab: 0,
    loggerEvents: [],
    sdkEvents: [],
  };

  private subscriptions: Subscription[] = [];

  public componentWillMount(): void {
    let id = 0;

    const subject = new Subject<{
      loggerEvent?: ILoggerEvent;
      sdkEvent?: Sdk.IEvent;
    }>();

    this.subscriptions.push(
      subject
        .pipe(
          switchMap(({ loggerEvent, sdkEvent }) => from(new Promise((resolve) => {
            const { loggerEvents, sdkEvents } = this.state;
            id += 1;
            if (loggerEvent) {
              this.setState({
                loggerEvents: [
                  { ...loggerEvent, id },
                  ...loggerEvents,
                ],
              }, resolve);
            } else if (sdkEvent) {
              this.setState({
                sdkEvents: [
                  { ...sdkEvent, id },
                  ...sdkEvents,
                ],
              }, resolve);
            }
          }))),
        )
        .subscribe(),

      this
        .logger
        .stream$
        .pipe(
          filter(event => !!event),
          map(loggerEvent => ({
            loggerEvent,
          })),
        )
        .subscribe(subject),

      this
        .sdk
        .event$
        .pipe(
          filter(event => !!event),
          map(sdkEvent => ({
            sdkEvent,
          })),
        )
        .subscribe(subject),
    );
  }

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public render() {
    const { sdk } = this.props;
    const { tab, loggerEvents, sdkEvents } = this.state;

    let content: any = null;

    switch (tab) {
      case 0:
        content = (
          <div className={styles.content}>
            {loggerEvents.map(({ id, type, args }) => {
              let result: any = null;

              switch (type) {
                case 'info':
                  result = (
                    <div key={`loggerEvent_${id}`}>
                      {args.map((arg, index) => (
                        <div key={`loggerEvent_${id}_${index}`}>
                          <ObjectInspector
                            data={toRawObject(arg)}
                          />
                        </div>
                      ))}
                    </div>
                  );
                  break;

                case 'error':
                  try {
                    result = (
                      <div key={`loggerEvent_${id}`}>
                        <ObjectInspector
                          data={toRawObject(args[0].toString())}
                        />
                      </div>
                    );
                  } catch (err) {
                    result = null;
                  }
                  break;

              }

              return result;
            })}
          </div>
        );
        break;
      case 1:
        content = (
          <div className={styles.content}>
            {sdkEvents.map(({ id, ...data }) => {
              return (
                <div key={`sdkEvent_${id}`}>
                  <ObjectInspector
                    data={toRawObject(data)}
                  />
                </div>
              );
            })}
          </div>
        );
        break;
      case 2:
        content = (
          <div className={styles.content}>
            <div>
              <ObjectInspector
                data={toRawObject(sdk)}
                expandLevel={1}
              />
            </div>
          </div>
        );
        break;
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.tabs}>
          <button
            className={tab === 0 ? styles.active : ''}
            onClick={this.createChangeTabHandler(0)}
          >
            console
            {loggerEvents.length ? ` (${loggerEvents.length})` : ''}
          </button>
          <button
            className={tab === 1 ? styles.active : ''}
            onClick={this.createChangeTabHandler(1)}
          >
            sdk.event$
            {sdkEvents.length ? ` (${sdkEvents.length})` : ''}
          </button>
          <button
            className={tab === 2 ? styles.active : ''}
            onClick={this.createChangeTabHandler(2)}
          >
            sdk.state
          </button>
        </div>
        {content}
      </div>
    );
  }

  private createChangeTabHandler(tab: number): () => any {
    return () => {
      this.setState({
        tab,
      });
    };
  }
}

export default connect<IProps, {}, {}, IProps>(
  state => state,
)(Footer);
