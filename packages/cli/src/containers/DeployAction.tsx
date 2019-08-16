import React from 'react';
import { SdkError } from '@archanova/sdk';
import { Box } from 'ink';
import { Form } from '../components';
import { ContextComponent } from '../context';
import { SdkService } from '../services';
import { Completed } from './Completed';

interface IState {
  app: SdkService.IApp;
  errors: { [key: string]: any };
  completed: boolean;
}

export class DeployAction extends ContextComponent<{}, IState> {
  public state: IState = {
    errors: {},
    app: null,
    completed: false,
  };

  public componentWillMount(): void {
    this.formSubmitted = this.formSubmitted.bind(this);

    const { sdkService: { state: { app } } } = this.context;

    this.setState({
      app,
    });
  }

  public render(): any {
    let result: React.ReactNode = null;
    const { app, completed, errors } = this.state;

    if (completed) {
      result = (
        <Completed />
      );
    } else if (app) {
      result = (
        <Box flexDirection="column">
          <Form
            initialValues={{
              description: app.description,
              callbackUrl: app.callbackUrl,
            }}
            schema={[{
              field: 'description',
              label: 'Application Description',
            }, {
              field: 'callbackUrl',
              label: 'Application Callback URL',
            }]}
            errors={errors}
            onSubmit={this.formSubmitted}
          />
        </Box>
      );
    }

    return result;
  }

  private formSubmitted(values: any): void {
    const { sdkService } = this.context;

    this.wrapAsync(async () => {
      try {
        const app = await sdkService.updateDeveloperApp(values);

        this.setState({
          app,
          completed: true,
        });
      } catch (err) {
        if (
          SdkError.isSdkError(err) &&
          err.type === SdkError.Types.Http &&
          err.data
        ) {
          this.setState({
            errors: err.data,
          });
        }
      }
    });
  }
}
