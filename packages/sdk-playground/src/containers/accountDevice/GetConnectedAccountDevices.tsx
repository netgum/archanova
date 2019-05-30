import React from 'react';
import { Example, InputText, Screen } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (page = 0) => `
${page ? `const page = ${page};` : ''}

sdk
  .getConnectedAccountDevices(${mergeMethodArgs(page && 'page')})
  .then(accountDevices => console.log('accountDevices', accountDevices));
  .catch(console.error);
`;

interface IState {
  page: string;
  pageParsed: number;
}

export class GetConnectedAccountDevices extends Screen<IState> {
  public state = {
    page: '0',
    pageParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.pageChanged = this.pageChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { page, pageParsed } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Devices"
          code={code(pageParsed)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            label="page"
            type="number"
            value={page}
            onChange={this.pageChanged}
          />
        </Example>
      </div>
    );
  }

  private pageChanged(page: string, pageParsed: number) {
    this.setState({
      page,
      pageParsed,
    });
  }

  private run(): void {
    const { pageParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountDevices', async (console) => {
        console.log('accountDevices', await this.sdk.getConnectedAccountDevices(pageParsed));
      });
  }

}
