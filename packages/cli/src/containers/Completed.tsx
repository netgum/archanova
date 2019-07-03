import React from 'react';
import {Color} from 'ink';

export class Completed extends React.Component {
  public componentDidMount(): void {
    setTimeout(() => {
      process.exit();
    }, 500);
  }

  public render(): any {
    return (
      <Color green={true}>
        Completed!
      </Color>
    );
  }
}
