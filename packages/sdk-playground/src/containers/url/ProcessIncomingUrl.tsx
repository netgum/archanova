import React from 'react';
import { Example, InputText, Screen } from '../../components';

const code = (url: string) => `
const url = ${url ? `"${url}"` : 'null'};

sdk.processIncomingUrl(url);
`;

interface IState {
  url: string;
}

export class ProcessIncomingUrl extends Screen<IState> {
  public state = {
    url: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.urlChanged = this.urlChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { url } = this.state;
    return (
      <div>
        <Example
          title="Process Incoming Url"
          code={code(url)}
          enabled={url && enabled}
          run={this.run}
        >
          <InputText
            value={url}
            label="url"
            type="text"
            onChange={this.urlChanged}
          />
        </Example>
      </div>
    );
  }

  private urlChanged(url: string): void {
    this.setState({
      url,
    });
  }

  private run(): void {
    const { url } = this.state;
    this
      .logger
      .wrapSync('sdk.processIncomingUrl', async () => {
        this.sdk.processIncomingUrl(url);
        this.setState({
          url: '',
        });
      });
  }
}
