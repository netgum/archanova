import { ethToWei } from '@netgum/utils';
import React, { Component } from 'react';
import { SdkContext } from '../sdk';
import { Button } from 'react-bootstrap';
import Highlight from 'react-highlight';
import { Block } from '../components';
import { generateRandomAddress } from '../utils';

export class AccountTransactions extends Component {
  static contextType = SdkContext;

  getAccountTransactions() {
    const { sdk } = this.context;
    sdk
      .getAccountTransactions()
      .then(accountTransactions => console.log('accountTransactions:', accountTransactions))
      .catch(console.error);
  }

  executeTransactions(to) {
    const { sdk } = this.context;

    const value = ethToWei(0.001);
    const data = Buffer.alloc(0);
    sdk
      .getGasPrice()
      .then((gasPrice) => {
        console.log('gasPrice:', gasPrice);

        return sdk
          .estimateAccountTransaction(to, value, data, gasPrice)
          .then((estimated) => {
            console.log('estimated:', estimated);

            return estimated
              ? sdk.executeAccountTransaction(estimated, gasPrice)
              : null;
          });
      })
      .then(hash => console.log('hash:', hash))
      .catch(console.error);
  }

  render() {
    const to = generateRandomAddress();

    return (
      <div>
        <h2>Account transactions</h2>
        <hr />
        <Block>
          <Highlight language="javascript">
            {
              `sdk
  .getAccountTransactions()
  .then(accountTransactions => console.log('accountTransactions:', accountTransactions))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.getAccountTransactions()}>
            Get account transactions
          </Button>
        </Block>
        <Block>
          <Highlight language="javascript">
            {
              `import { ethToWei } from '@netgum/utils';
const to = '${to}';
const value =  const value = ethToWei(0.001);
const data = Buffer.alloc(0);
sdk
  .getGasPrice()
  .then((gasPrice) => {
    console.log('gasPrice:', gasPrice);

    return sdk
      .estimateAccountTransaction(to, value, data, gasPrice)
      .then((estimated) => {
        console.log('estimated:', estimated);

        return estimated
            ? sdk.executeAccountTransaction(estimated, gasPrice)
            : null;
      });
  })
  .then(hash => console.log('hash:', hash))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.executeTransactions(to)}>
            Estimate and execute transaction
          </Button>
        </Block>
      </div>
    );
  }
}
