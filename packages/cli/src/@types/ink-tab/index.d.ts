declare module 'ink-box' {
  import { Component } from 'react';

  declare class Tab extends Component<Tab.IProps> {
    //
  }

  declare namespace Tab {
    export interface IProps {
      [key: string]: any;
    }
  }

  export = Tab;
}
