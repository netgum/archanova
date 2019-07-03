import React from 'react';
import { sdkModules } from '@archanova/sdk';
import { Box } from 'ink';
import { Form } from '../components';
import { ContextComponent } from '../context';

interface IState {
  errors: { [key: string]: any };
}

export class InitAction extends ContextComponent<{}, IState> {
  public state: IState = {
    errors: {},
  };

  public componentWillMount(): void {
    this.formSubmitted = this.formSubmitted.bind(this);
  }

  public componentWillUnmount(): void {
    //
  }

  public render(): any {
    const { errors } = this.state;

    return (
      <Box flexDirection="column">
        <Form
          initialValues={{}}
          schema={[{
            field: 'name',
            label: 'Application Name',
          }, {
            field: 'description',
            label: 'Application Description',
          }]}
          errors={errors}
          onSubmit={this.formSubmitted}
        />
      </Box>
    );
  }

  private formSubmitted(values: any): void {
    const { sdkService, templateService } = this.context;

    this.wrapAsync(async () => {
      try {
        const app = await sdkService.createDeveloperApp(values);
        if (!await templateService.templateExists()) {
          await templateService.createTemplate(app);
        }
      } catch (err) {
        if (
          err instanceof sdkModules.Api.Error &&
          err.type === sdkModules.Api.Error.Types.BadRequest &&
          err.errors
        ) {
          this.setState({
            errors: err.errors,
          });
        }
      }
    });
  }
}
