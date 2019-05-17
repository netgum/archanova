import React from 'react';
import { Example, Screen, InputText } from '../../components';
import { getCurrentEndpoint, getTargetEndpoint } from '../../shared';

const code1 = () => `
console.log('url', sdk.createRequestAddAccountDeviceUrl());
`;
const code2 = (endpoint: string, callbackEndpoint: string) => `
const options = {
  ${`
${endpoint ? `endpoint: "${endpoint}",` : ''}
${callbackEndpoint ? `  callbackEndpoint: "${callbackEndpoint}",` : ''}
  `.trim()}
};

console.log('url', sdk.createRequestAddAccountDeviceUrl(options));
`;

interface IState {
  endpoint: string;
  callbackEndpoint: string;
}

export class CreateRequestAddAccountDeviceUrl extends Screen<IState> {
  public state = {
    endpoint: getTargetEndpoint(),
    callbackEndpoint: getCurrentEndpoint(),
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.endpointChanged = this.endpointChanged.bind(this);
    this.callbackEndpointChanged = this.callbackEndpointChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { endpoint, callbackEndpoint } = this.state;
    return (
      <div>
        <Example
          title="Create Request Add Account Device Url"
          code={endpoint || callbackEndpoint
            ? code2(endpoint, callbackEndpoint)
            : code1()
          }
          enabled={enabled}
          run={this.run}
        >
          <InputText
            value={endpoint}
            label="options.endpoint"
            type="text"
            onChange={this.endpointChanged}
          />
          <InputText
            value={callbackEndpoint}
            label="options.callbackEndpoint"
            type="text"
            onChange={this.callbackEndpointChanged}
          />
        </Example>
      </div>
    );
  }

  private endpointChanged(endpoint: string): void {
    this.setState({
      endpoint,
    });
  }

  private callbackEndpointChanged(callbackEndpoint: string): void {
    this.setState({
      callbackEndpoint,
    });
  }

  private run(): void {
    const { endpoint, callbackEndpoint } = this.state;
    this
      .logger
      .wrapSync('sdk.createRequestAddAccountDeviceUrl', async (console) => {
        console.log('url', this.sdk.createRequestAddAccountDeviceUrl({
          endpoint: endpoint || null,
          callbackEndpoint: callbackEndpoint || null,
        }));
      });
  }
}
