declare module 'ink-box' {
  import { Component } from 'react';

  declare class Box extends Component<Box.IProps> {
    //
  }

  declare namespace Box {
    export interface IProps {
      borderStyle?: string;
      borderColor?: string;
      float?: string;
      padding?: number;
    }
  }

  export = Box;
}
