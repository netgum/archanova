import React from 'react';
import { Example, Screen, InputCheckBox } from '../../components';

const code1 = () => `
sdk
  .reset()
  .then(() => console.log('reseted'))
  .catch(console.error);
`;

const code2 = (device: boolean, session: boolean) => `
const options = {
  ${`
${device ? 'device: true,' : ''}
${session ? '  session: true,' : ''}
`.trim()}
};

sdk
  .reset(options)
  .then(() => console.log('reseted'))
  .catch(console.error);
`;

interface IState {
  device: boolean;
  session: boolean;
}

export class Reset extends Screen<IState> {
  public state = {
    device: false,
    session: false,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.deviceChanged = this.deviceChanged.bind(this);
    this.sessionChanged = this.sessionChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { device, session } = this.state;
    return (
      <div>
        <Example
          title="Reset SDK"
          code={device || session
            ? code2(device, session)
            : code1()
          }
          enabled={enabled}
          run={this.run}
        >
          <InputCheckBox
            label="options.device"
            checked={device}
            onChange={this.deviceChanged}
          />
          <InputCheckBox
            label="options.session"
            checked={session}
            onChange={this.sessionChanged}
          />
        </Example>
      </div>
    );
  }

  private deviceChanged(device: boolean): void {
    this.setState({
      device,
    });
  }

  private sessionChanged(session: boolean): void {
    this.setState({
      session,
    });
  }

  private run(): void {
    const { device, session } = this.state;
    this
      .logger
      .wrapSync('sdk.reset', async (console) => {
        await this.sdk.reset({
          device,
          session,
        });

        console.log('reseted');
      });
  }
}
