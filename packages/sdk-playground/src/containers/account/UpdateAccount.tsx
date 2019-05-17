import React from 'react';
import { Example, InputText, Screen } from '../../components';
import { generateRandomEnsLabel } from '../../shared';
const code = (ensLabel: string) => `
const ensLabel = ${ensLabel ? `"${ensLabel}"` : 'null'};

sdk
  .updateAccount(ensLabel)
  .then(account => console.log('account', account)
  .catch(console.error);
`;

interface IState {
  ensLabel: string;
}

export class UpdateAccount extends Screen<IState> {
  public state = {
    ensLabel: generateRandomEnsLabel(),
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
          title="Update Account"
          code={code(ensLabel)}
          enabled={ensLabel && enabled}
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
      .wrapSync('sdk.updateAccount', async (console) => {
        console.log('account', await this.sdk.updateAccount(ensLabel));
      });
  }
}
