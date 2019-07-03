import React from 'react';
import { Box, BoxProps, Color } from 'ink';
import InkSpinner from 'ink-spinner';

export interface IProps extends BoxProps {
  children: string;
}

export class Spinner extends React.Component<IProps> {
  public render(): any {
    const { children, ...props } = this.props;

    return (
      <Box {...props}>
        <Color green>
          <InkSpinner type={'point' as any} />
        </Color>
        {` ${children.trim()}`}
      </Box>
    );
  }
}
