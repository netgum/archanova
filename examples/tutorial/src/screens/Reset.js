import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Highlight from 'react-highlight';
import { Block } from '../components';
import { SdkContext } from '../sdk';

export class Reset extends Component {
  static contextType = SdkContext;

  reset(options = {}) {
    const { sdk } = this.context;
    sdk
      .reset(options)
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <h2>Reset</h2>
        <hr />
        <Block>
          <Highlight language="javascript">
            {
              `sdk
  .reset()
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.reset()}>
            Reset
          </Button>
        </Block>
        <Block>
          <p>Reset and generate new device:</p>
          <Highlight language="javascript">
            {
              `sdk
  .reset({ device: true })
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.reset({ device: true })}>
            Reset
          </Button>
        </Block>
      </div>
    );
  }

}
