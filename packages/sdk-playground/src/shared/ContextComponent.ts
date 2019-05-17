import React from 'react';
import { IContextProps } from './interfaces';
import { context } from './context';

export abstract class ContextComponent<P = any, S = any> extends React.Component<P, S> {
  public static contextType = context;

  public context: IContextProps;

  public get logger(): IContextProps['logger'] {
    return this.context ?
      this.context.logger
      : null;
  }

  public get sdk(): IContextProps['sdk'] {
    return this.context ?
      this.context.sdk
      : null;
  }

  public abstract render(): any;
}
