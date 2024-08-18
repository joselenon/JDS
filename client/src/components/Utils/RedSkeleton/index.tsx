// Add custom border radius
import React from 'react';

import * as styles from './styles';

export default function RedSkeleton({ children }: any) {
  return <styles.SkeletonContainer id="red">{children}</styles.SkeletonContainer>;
}
