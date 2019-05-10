declare module 'ink-spinner' {
  import { Component } from 'react';

  declare class Spinner extends Component<Spinner.IProps> {
    //
  }

  declare namespace Spinner {
    export interface IProps {
      type: 'dots';
    }
  }

  export = Spinner;
}
