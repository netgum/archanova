import React from 'react';
import { Example, Screen, InputText } from '../../components';
import { generateRandomEnsLabel, mergeMethodArgs } from '../../shared';

const code = (ensLabel: string) => `
${ensLabel ? `const ensLabel = "${ensLabel}";` : ''}

sdk
  .createAccount(${mergeMethodArgs(ensLabel && 'ensLabel')})
  .then(account => console.log('account', account))
  .catch(console.error);
`;

interface IState {
  ensLabel: string;
}

export class CreateAccount extends Screen<IState> {
  public state = {
    ensLabel: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.ensLabelChanged = this.ensLabelChanged.bind(this);
    this.generateEnsLabel = this.generateEnsLabel.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { ensLabel } = this.state;
    return (
      <div>
        <Example
          title="Create Account"
          code={code(ensLabel)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            label="ensLabel"
            value={ensLabel}
            onChange={this.ensLabelChanged}
            onRandomClick={this.generateEnsLabel}
          />
        </Example>
      </div>
    );
  }

  private ensLabelChanged(ensLabel: string): void {
    this.setState({
      ensLabel,
    });
  }

  private generateEnsLabel(): void {
    this.setState({
      ensLabel: generateRandomEnsLabel(),
    });
  }

  private run(): void {
    const { ensLabel } = this.state;
    this
      .logger
      .wrapSync('sdk.createAccount', async (console) => {
        console.log('account', await this.sdk.createAccount(ensLabel || null));
      });
  }
}
