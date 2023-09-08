import React from 'react';

import * as styles from './styles';

export interface Props {
  direction: 'VERTICAL' | 'HORIZONTAL';
  width: string | undefined;
  height: string | undefined;
  color: string | undefined;
}

export default function CustomHR(props: Props) {
  const { direction, width, height, color } = props;

  return (
    <styles.HRContainer
      direction={direction}
      width={width}
      height={height}
      color={color}
    />
  );
}
