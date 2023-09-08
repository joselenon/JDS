import React, { ReactNode } from 'react';

import * as styles from './styles';

interface Props {
  children: ReactNode;
}

export default function HoverAnimatedElement({ children }: Props) {
  return <styles.Container>{children}</styles.Container>;
}
