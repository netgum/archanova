import React, { Component } from 'react';
import { SdkContext } from '../sdk';
import { Button, Table } from 'react-bootstrap';
import { Block } from '../components';
import Highlight from 'react-highlight';

export class ManageAccountDevices extends Component {
  static contextType = SdkContext;

  state = {
    accountDevices: null,
  };

  getAccountDevices() {
    const { sdk } = this.context;
    sdk
      .getAccountDevices()
      .then((accountDevices) => {
        console.log('accountDevices:', accountDevices);

        this.setState({
          accountDevices,
        });
      })
      .catch(console.error);
  }

  deployAccountDevice(deviceAddress) {
    const { sdk } = this.context;
    sdk
      .getGasPrice()
      .then((gasPrice) => {
        console.log('gasPrice:', gasPrice);

        return sdk
          .estimateAccountDeviceDeployment(deviceAddress, gasPrice)
          .then((estimated) => {
            console.log('estimated:', estimated);

            return estimated
              ? sdk.deployAccountDevice(deviceAddress, estimated, gasPrice)
              : null;
          });
      })
      .then(hash => console.log('hash:', hash))
      .catch(console.error);
  }

  removeAccountDevice(deviceAddress) {
    const { sdk } = this.context;
    sdk
      .removeAccountDevice(deviceAddress)
      .catch(console.error);
  }

  render() {
    const { accountDevices } = this.state;

    return (
      <div>
        <h2>Manage account devices</h2>
        <hr />
        <Block>
          <Highlight language="javascript">
            {
              `sdk
  .getAccountDevices()
  .then(accountDevices => console.log('accountDevices:', accountDevices))
  .catch(console.error);`
            }
          </Highlight>
          <Button variant="primary" onClick={() => this.getAccountDevices()}>
            Get account devices
          </Button>
        </Block>
        {accountDevices && accountDevices.length
          ? (
            <Block>
              <p>Deploy account device:</p>
              <Highlight language="javascript">
                {
                  `const deviceAddress = '${accountDevices[0].deviceAddress}';
sdk
  .getGasPrice()
  .then((gasPrice) => {
    console.log('gasPrice:', gasPrice);

    return sdk
      .estimateAccountDeviceDeployment(deviceAddress, gasPrice)
      .then((estimated) => {
        console.log('estimated:', estimated);

        return estimated
            ? sdk.deployAccountDevice(deviceAddress, estimated, gasPrice)
            : null;
      });
  })
  .then(hash => console.log('hash:', hash))
  .catch(console.error);`
                }
              </Highlight>
              <p>Remove account device:</p>
              <Highlight language="javascript">
                {
                  `const deviceAddress = "${accountDevices[0].deviceAddress}";
sdk
  .removeAccountDevice(deviceAddress)
  .catch(console.error);`
                }
              </Highlight>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Device address</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {accountDevices.map(({ deviceAddress }) => (
                    <tr key={deviceAddress}>
                      <td>{deviceAddress}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => this.deployAccountDevice(deviceAddress)}
                        >
                          Deploy
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => this.removeAccountDevice(deviceAddress)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Block>
          )
          : null
        }
      </div>
    );
  }
}
