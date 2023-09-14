import React from 'react';

import * as styles from './styles';

interface IOpacitySkeletonProps {
  color?: string;
}

export default function OpacitySkeleton({
  color = 'var(--secondary-color)',
}: IOpacitySkeletonProps) {
  return <styles.SkeletonCotainer color={color} />;
}
