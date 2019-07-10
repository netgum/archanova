import { anyToHex, generateRandomPrivateKey } from '@netgum/utils';
import React from 'react';
import { Subscription } from 'rxjs';
import { Example, Screen, InputText, InputSelect } from '../../components';
import { buildSdkEnv } from '../../shared';

const code1 = () => `
sdk
  .initialize()
  .then(() => console.log('initialized'))
  .catch(console.error);
`;
const code2 = (devicePrivateKey: string, sdkEnv: string) => `
${!sdkEnv ? '' : `
const environment = ${sdkEnv === 'local' ? 'createLocalSdkEnvironment()' : `getSdkEnvironment('${sdkEnv}')`}
  .setConfig('storageAdapter', localStorage)
  .setConfig('urlAdapter', {
    open: url => document.location = url,
    addListener: listener => listener(document.location.toString()),
  });
`}
const options = {
  ${`
${sdkEnv ? 'environment,' : ''}
${devicePrivateKey ? `  device: { privateKey: "${devicePrivateKey}" },` : ''}
`.trim()}
};

sdk
  .initialize(options)
  .then(() => console.log('initialized'))
  .catch(console.error);
`;

interface IState {
  devicePrivateKey: string;
  defaultSdkEnv: string;
  sdkEnv: string;
}

export class Initialize extends Screen<IState> {
  public state: IState = {
    devicePrivateKey: '',
    defaultSdkEnv: null,
    sdkEnv: null,
  };

  private subscriptions: Subscription[] = [];

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.subscriptions = [
      this
        .config
        .sdkEnv$
        .subscribe(sdkEnv => this.setState({
          sdkEnv,
          defaultSdkEnv: sdkEnv,
        })),
    ];

    this.setState({
      defaultSdkEnv: this.config.sdkEnv,
      sdkEnv: this.config.sdkEnv,
    });

    this.devicePrivateKeyChanged = this.devicePrivateKeyChanged.bind(this);
    this.generateDevicePrivateKey = this.generateDevicePrivateKey.bind(this);
    this.environmentChanged = this.environmentChanged.bind(this);
  }

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { devicePrivateKey, defaultSdkEnv, sdkEnv } = this.state;

    return (
      <div>
        <Example
          title="Initialize SDK"
          code={devicePrivateKey || sdkEnv !== defaultSdkEnv
            ? code2(devicePrivateKey, sdkEnv === defaultSdkEnv ? null : sdkEnv)
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
          <InputSelect
            label="options.environment"
            selected={sdkEnv}
            values={this.config.sdkEnvs}
            onChange={this.environmentChanged}
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

  private environmentChanged(sdkEnv: string) {
    this.setState({
      sdkEnv,
    });
  }

  private run(): void {
    const { sdkEnv, defaultSdkEnv, devicePrivateKey } = this.state;
    this
      .logger
      .wrapSync('sdk.initialize', async (console) => {
        if (sdkEnv !== defaultSdkEnv ) {
          this.config.sdkEnv = sdkEnv;
        }

        await this.sdk.initialize({
          device: {
            privateKey: devicePrivateKey || null,
          },
          environment: sdkEnv !== defaultSdkEnv ? buildSdkEnv(sdkEnv) : null,
        });

        console.log('initialized');
      });
  }
}
