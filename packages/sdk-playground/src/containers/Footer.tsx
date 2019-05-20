import React from 'react';
import { Subscription, from } from 'rxjs';
import { Sdk } from '@archanova/sdk';
import { filter, switchMap } from 'rxjs/operators';
import { ObjectInspector } from 'react-inspector';
import { ContextComponent, ILoggerEvent, toRawObject } from '../shared';
import styles from './Footer.module.scss';

interface IState {
  tab: number;
  loggerEvents: (ILoggerEvent & { id: number })[];
  sdkEvents: (Sdk.IEvent & { id: number })[];
}

export default class Footer extends ContextComponent<{}, IState> {
  public state = {
    tab: 0,
    loggerEvents: [],
    sdkEvents: [],
  };

  private subscriptions: Subscription[] = [];

  public componentWillMount(): void {
    let id = 0;
    this.subscriptions.push(
      this
        .logger
        .stream$
        .pipe(
          filter(event => !!event),
          switchMap(loggerEvent => from(new Promise((resolve) => {
            const { loggerEvents } = this.state;
            id += 1;
            this.setState({
              loggerEvents: [
                { ...loggerEvent, id },
                ...loggerEvents,
              ],
            }, resolve);
          }))),
        )
        .subscribe(),

      this
        .sdk
        .event$
        .pipe(
          filter(event => !!event),
        )
        .subscribe((sdkEvent) => {
          const { sdkEvents } = this.state;

          this.setState({
            sdkEvents: [
              { ...sdkEvent, id },
              ...sdkEvents,
            ],
          });
        }),
    );
  }

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public render() {
    const { tab, loggerEvents, sdkEvents } = this.state;

    let content: any = null;

    switch (tab) {
      case 0:
        content = (
          <div className={styles.content}>
            {loggerEvents.map(({ id, args }) => {
              return (
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
            })}
            {loggerEvents.length ? null : <div>Not found</div>}
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
            {sdkEvents.length ? null : <div>Not found</div>}
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