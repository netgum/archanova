import React from 'react';
import { sdkConstants } from '@archanova/sdk';
import { Example, InputText, Screen, InputSelect } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code = (page = 0, filtersState: sdkConstants.AccountPaymentStates) => `
${!filtersState ? '' : 'import { sdkConstants } from \'@archanova/sdk\';'}

${page || filtersState ? `const page = ${page};` : ''}
${!filtersState ? '' : `
const filters = {
  state: sdkConstants.AccountPaymentStates.${filtersState},
};
`}
sdk
  .getConnectedAccountPayments(${mergeMethodArgs((page || filtersState) && 'page', filtersState && 'filters')})
  .then(accountPayments => console.log('accountPayments', accountPayments))
  .catch(console.error);
`;

interface IState {
  page: string;
  pageParsed: number;
  filtersState: string;
  filtersStateParsed: sdkConstants.AccountPaymentStates;
}

export class GetConnectedAccountPayments extends Screen<IState> {
  private static filtersStates: string[] = [
    'All',
    ...Object
      .values(sdkConstants.AccountPaymentStates)
      .filter(state => state !== sdkConstants.AccountPaymentStates.Locked),
  ];

  private static parseFiltersState(filtersState: string): sdkConstants.AccountPaymentStates {
    return (filtersState === 'All' ? null : filtersState) as any;
  }

  public state = {
    page: '0',
    pageParsed: 0,
    filtersState: GetConnectedAccountPayments.filtersStates[0],
    filtersStateParsed: null,
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.pageChanged = this.pageChanged.bind(this);
    this.filtersStateChanged = this.filtersStateChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { page, pageParsed, filtersState, filtersStateParsed } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Payments"
          code={code(pageParsed, filtersStateParsed)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            label="page"
            type="number"
            value={page}
            onChange={this.pageChanged}
          />
          <InputSelect
            label="filters.state"
            selected={filtersState}
            values={GetConnectedAccountPayments.filtersStates}
            onChange={this.filtersStateChanged}
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

  private filtersStateChanged(filtersState: string) {
    this.setState({
      filtersState,
      filtersStateParsed: GetConnectedAccountPayments.parseFiltersState(filtersState),
    });
  }

  private run(): void {
    const { pageParsed, filtersStateParsed } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountPayments', async (console) => {
        console.log('accountPayments', await this.sdk.getConnectedAccountPayments(pageParsed, {
          state: filtersStateParsed,
        }));
      });
  }
}
