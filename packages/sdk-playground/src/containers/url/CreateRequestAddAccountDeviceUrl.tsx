import React from 'react';
import { Example, Screen, InputText, Url } from '../../components';
import { getCurrentEndpoint, getTargetEndpoint } from '../../shared';

const code1 = () => `
console.log('mobileUrl', sdk.createRequestAddAccountDeviceUrl());
`;
const code2 = (endpoint: string, callbackEndpoint: string) => `
const options = {
  ${`
${endpoint ? `endpoint: "${endpoint}",` : ''}
${callbackEndpoint ? `  callbackEndpoint: "${callbackEndpoint}",` : ''}
  `.trim()}
};

console.log('redirectUrl', sdk.createRequestAddAccountDeviceUrl(options));
console.log('mobileUrl', sdk.createRequestAddAccountDeviceUrl());
`;

interface IState {
  endpoint: string;
  callbackEndpoint: string;
  mobileUrl: string;
  redirectUrl: string;
}

export class CreateRequestAddAccountDeviceUrl extends Screen<IState> {
  public state = {
    endpoint: getTargetEndpoint(),
    callbackEndpoint: getCurrentEndpoint(),
    mobileUrl: '',
    redirectUrl: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.endpointChanged = this.endpointChanged.bind(this);
    this.callbackEndpointChanged = this.callbackEndpointChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { endpoint, callbackEndpoint, mobileUrl, redirectUrl } = this.state;
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
        {enabled && mobileUrl && (
          <Url
            mobile={mobileUrl}
            redirect={redirectUrl}
          />
        )}
      </div>
    );
  }

  private endpointChanged(endpoint: string): void {
    this.setState({
      endpoint,
      mobileUrl: null,
    });
  }

  private callbackEndpointChanged(callbackEndpoint: string): void {
    this.setState({
      callbackEndpoint,
      mobileUrl: null,
    });
  }

  private run(): void {
    const { endpoint, callbackEndpoint } = this.state;
    this
      .logger
      .wrapSync('sdk.createRequestAddAccountDeviceUrl', async (console) => {
        const redirectUrl = this.sdk.createRequestAddAccountDeviceUrl({
          endpoint: endpoint || null,
          callbackEndpoint: callbackEndpoint || null,
        });
        const mobileUrl = this.sdk.createRequestAddAccountDeviceUrl();

        console.log('redirectUrl', redirectUrl);
        console.log('mobileUrl', mobileUrl);

        this.setState({
          mobileUrl,
          redirectUrl: endpoint ? redirectUrl : null,
        });
      });
  }
}
