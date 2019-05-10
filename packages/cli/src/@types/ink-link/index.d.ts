declare module 'ink-link' {
  import { Component } from 'react';

  declare class Link extends Component<Spinner.IProps> {
    //
  }

  declare namespace Link {
    export interface IProps {
      url: string;
    }
  }

  export = Link;
}
