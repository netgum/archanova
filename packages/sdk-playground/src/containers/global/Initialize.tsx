import { anyToHex, generateRandomPrivateKey } from '@netgum/utils';
import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code1 = () => `
sdk
  .initialize()
  .then(() => console.log('initialized'))
  .catch(console.error);
`;

const code2 = (devicePrivateKey: string) => `
const options = {
  device: {
    privateKey: "${devicePrivateKey}",
  },
};

sdk
  .initialize(options)
  .then(() => console.log('initialized'))
  .catch(console.error);
`;

interface IState {
  devicePrivateKey: string;
}

export class Initialize extends Screen<IState> {
  public state: IState = {
    devicePrivateKey: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.devicePrivateKeyChanged = this.devicePrivateKeyChanged.bind(this);
    this.generateDevicePrivateKey = this.generateDevicePrivateKey.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { devicePrivateKey } = this.state;

    return (
      <div>
        <Example
          title="Initialize SDK"
          code={devicePrivateKey
            ? code2(devicePrivateKey)
            : code1()
          }
          enabled={enabled}
          run={this.run}
        >
          <InputText
            label="options.device.privateKey"
            value={devicePrivateKey}
            onChange={this.devicePrivateKeyChanged}
            onRandomClick={this.generateDevicePrivateKey}
          />
        </Example>
      </div>
    );
  }

  private devicePrivateKeyChanged(devicePrivateKey: string): void {
    this.setState({
      devicePrivateKey,
    });
  }

  private generateDevicePrivateKey(): void {
    this.setState({
      devicePrivateKey: anyToHex(generateRandomPrivateKey(), {
        add0x: true,
      }),
    });
  }

  private run(): void {
    const { devicePrivateKey } = this.state;
    this
      .logger
      .wrapSync('sdk.initialize', async (console) => {
        await this.sdk.initialize({
          device: {
            privateKey: devicePrivateKey || null,
          },
        });

        console.log('initialized');
      });
  }
}
