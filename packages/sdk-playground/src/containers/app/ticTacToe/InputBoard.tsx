import React from 'react';
import { anyToBuffer, anyToHex } from '@netgum/utils';
import styles from './InputBoard.module.scss';

interface IProps {
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => any;
}

interface IState {
  player: number;
  fields: number[];
  move: number;
}

export class InputBoard extends React.Component<IProps, IState> {
  private static initState({ value }: IProps): IState {
    const fields: number[] = Array(9).fill(0);
    const data = anyToBuffer(value, {
      defaults: Buffer.alloc(0),
    });

    for (let i = 0; i < 9; i += 1) {
      if (
        data[i] === 1 ||
        data[i] === 2
      ) {
        fields[i] = data[i];
      }
    }

    return {
      fields,
      player: 1,
      move: null,
    };
  }

  public state = InputBoard.initState(this.props);

  public componentWillReceiveProps(props: IProps): void {
    if (this.props.value !== props.value) {
      this.setState(InputBoard.initState(props));
    }
  }

  public render(): any {
    const { disabled } = this.props;
    const { fields, move, player } = this.state;

    return (
      <div className={styles.content}>
        <div>data</div>
        <div>
          {fields.map((value, index) => {

            const onClick = !!value || disabled
              ? null
              : this.createOnClickHandler(index);

            if (move === index) {
              value = player;
            }

            let char = '&nbsp;';

            switch (value) {
              case 1:
                char = 'o';
                break;
              case 2:
                char = 'x';
                break;
            }

            return (
              <button
                key={`field_${index}`}
                disabled={!onClick}
                onClick={onClick}
                dangerouslySetInnerHTML={{
                  __html: char,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private createOnClickHandler(index: number): any {
    const { onChange } = this.props;
    const { fields, player } = this.state;
    let { move } = this.state;

    return () => {
      if (onChange) {
        move = (move === index) ? null : index;

        const value = anyToHex(
          Buffer.from(
            fields.map(((value, index) => index === move ? player : value)),
          ), {
            add0x: true,
          },
        );

        this.setState({
          move,
        }, () => onChange(value));

      }
    };
  }
}
