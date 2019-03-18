import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Highlight from 'react-highlight';
import { SdkContext } from '../sdk';

export class Initialize extends Component {
  static contextType = SdkContext;

  initialize() {
    const { sdk } = this.context;
    sdk
      .initialize()
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <h2>Initialize</h2>
        <hr />
        <Highlight language="javascript">
          {
            `sdk
  .initialize()
  .catch(console.error);`
          }
        </Highlight>
        <Button variant="primary" onClick={() => this.initialize()}>
          Initialize
        </Button>
      </div>
    );
  }

}
