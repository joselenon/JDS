import React from 'react';

import * as styles from './styles';

interface IPrizePool {
  prizePool: number;
}

export default function PrizePool({ prizePool }: IPrizePool) {
  return (
    <styles.PotContainer>
      <h2>Pot</h2>
      <styles.PotText>{prizePool}</styles.PotText>
    </styles.PotContainer>
  );
}
