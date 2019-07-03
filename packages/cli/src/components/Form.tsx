import React from 'react';
import { Box, Color } from 'ink';
import TextInput from 'ink-text-input';

export interface IProps {
  initialValues: { [key: string]: string };
  schema: {
    label: string;
    field: string;
  }[];
  errors?: { [key: string]: string };
  onSubmit?: (value: any) => void;
}

export interface IState {
  active: string;
  errors: { [key: string]: string };
  values: { [key: string]: string };
}

export class Form extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    errors: {},
    onSubmit: () => null,
  };

  private static initState({ initialValues, errors, schema }: IProps): IState {
    const values = { ...initialValues };
    let active: string = null;

    for (const { field } of schema) {
      if (!active && !values[field]) {
        active = field;
        break;
      }
    }

    if (!active && schema.length) {
      active = schema[0].field;
    }

    return {
      active,
      errors,
      values,
    };
  }

  public state = Form.initState(this.props);

  public componentWillReceiveProps({ schema, errors }: Readonly<IProps>): void {
    const errorFields = Object.keys(errors);

    if (errorFields.length) {
      const { field: active } = schema.find(({ field }) => errorFields.includes(field));

      this.setState({
        active,
        errors,
      });
    }
  }

  public render(): any {
    const { schema } = this.props;
    const { active, values, errors } = this.state;

    return (
      <Box flexDirection={'column'}>
        {schema.map(({ label, field }) => {
          return (
            <Box
              key={field}
              flexDirection={'column'}
              marginBottom={1}
            >
              <Color
                blueBright={!errors[field]}
                redBright={!!errors[field]}
              >
                {label}
              </Color>
              {field === active
                ? (
                  <TextInput
                    value={values[field] || ''}
                    onChange={this.createFieldChanged(field)}
                    onSubmit={this.createFieldSubmitted()}
                  />
                )
                : (
                  <Color grey={true}>{values[field] || ' '}</Color>
                )
              }
              {!errors[field] ? null : (
                <Color redBright={true}>{errors[field]}</Color>
              )}
            </Box>
          );
        })}
      </Box>
    );
  }

  public createFieldChanged(field: string): (value: string) => any {
    return (value) => {

      if (value.includes('\t')) {
        this.activateNextField();
        return;
      }

      const { values, errors } = this.state;

      this.setState({
        errors: {
          ...errors,
          [field]: null,
        },
        values: {
          ...values,
          [field]: value,
        },
      });
    };
  }

  public activateNextField() {
    const { schema } = this.props;
    const { active } = this.state;

    let index = schema.findIndex(({ field }) => active === field);
    if (index !== -1) {
      index += 1;
      if (index >= schema.length) {
        index = 0;
      }

      this.setState({
        active: schema[index].field,
      });
    }
  }

  public createFieldSubmitted(): () => any {
    return () => {
      const { onSubmit } = this.props;
      const { values } = this.state;

      onSubmit(values);
    };
  }
}
