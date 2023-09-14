import React from 'react';
import { v4 } from 'uuid';

import * as styles from './styles';
import OpacitySkeleton from '../../../../Utils/OpacitySkeleton';

export default function LastWinners() {
  const skeletonLastWinnersHTML = [];
  for (let i = 0; i < 10; i++) {
    skeletonLastWinnersHTML.push(
      <div key={v4()} style={{ width: 20, height: 20 }}>
        <OpacitySkeleton />
      </div>,
    );
  }

  return (
    <styles.LastWinnersContainer>
      <h2>Last Winners</h2>
      <styles.RoundsContainer>{skeletonLastWinnersHTML}</styles.RoundsContainer>
    </styles.LastWinnersContainer>
  );
}
