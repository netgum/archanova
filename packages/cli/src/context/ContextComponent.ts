import React from 'react';
import { Subscription } from 'rxjs';
import { IContextProps } from './interfaces';
import { context } from './context';

export abstract class ContextComponent<P = any, S = any> extends React.Component<P, S> {
  public static contextType = context;

  public context: IContextProps;
  private subscriptions: Subscription[] = [];

  public abstract render(): any;

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  protected wrapAsync(fun: () => Promise<any>): void {
    fun().catch(err => console.error(err));
  }

  protected addSubscriptions(...subscriptions: Subscription[]): void {
    this.subscriptions = [
      ...this.subscriptions,
      ...subscriptions,
    ];
  }
}
