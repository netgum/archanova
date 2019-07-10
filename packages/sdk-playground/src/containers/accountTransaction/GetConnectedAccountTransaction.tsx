import React from 'react';
import { Example, Screen, InputText } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (hash: string, index = 0) => `
const hash = ${hash ? `"${hash}"` : 'null'};
${index ? `const index = ${index};` : ''}

sdk
  .getConnectedAccountTransaction(${mergeMethodArgs('hash', index && 'index')})
  .then(accountTransaction => console.log('accountTransaction', accountTransaction))
  .catch(console.error);
`;

interface IState {
  hash: string;
  index: string;
  indexParsed: number;
}

export class GetConnectedAccountTransaction extends Screen<IState> {
  public state = {
    hash: '',
    index: '0',
    indexParsed: 0,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.hashChanged = this.hashChanged.bind(this);
    this.indexChanged = this.indexChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { hash, index, indexParsed } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Transaction"
          code={code(hash, indexParsed)}
          enabled={hash && enabled}
          run={this.run}
        >
          <InputText
            value={hash}
            label="hash"
            type="text"
            onChange={this.hashChanged}
          />
          <InputText
            label="index"
            type="number"
            value={index}
            onChange={this.indexChanged}
          />
        </Example>
      </div>
    );
  }

  private hashChanged(hash: string): void {
    this.setState({
      hash,
    });
  }
  private indexChanged(index: string, indexParsed: number) {
    this.setState({
      index,
      indexParsed,
    });
  }

  private run(): void {
    const { hash, indexParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountTransaction', async (console) => {
        console.log('accountTransaction', await this.sdk.getConnectedAccountTransaction(hash, indexParsed));
      });
  }
}
