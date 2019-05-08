import React from 'react';
import { Box, BoxProps } from 'ink';
import { generate } from 'qrcode-terminal';

export interface IProps extends BoxProps {
  url: string;
  small?: boolean;
}

export interface IState {
  data: string;
}

export class QrCode extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    small: false,
  };

  public state = {
    data: '',
  };

  public componentWillReceiveProps(nextProps: Readonly<IProps>): void {
    this.generateFromProps(nextProps);
  }

  public componentWillMount(): void {
    this.generateFromProps(this.props);
  }

  public render(): any {
    const { data } = this.state;
    const { url, small, ...props } = this.props;

    return (
      <Box {...props}>
        {data}
      </Box>
    );
  }

  private generateFromProps({ url, small }: IProps): void {
    generate(url, { small }, (data) => {
      this.setState({
        data,
      });
    });
  }
}
