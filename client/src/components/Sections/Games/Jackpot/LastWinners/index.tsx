import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import * as styles from './styles';
import OpacitySkeleton from '../../../../Utils/OpacitySkeleton';
import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';

interface ILastWinnersProps {
  lastJackpotsInfo: TGetJackpotResponse[];
}

export default function LastWinners({ lastJackpotsInfo }: ILastWinnersProps) {
  const [lastWinners, setLastWinners] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const lastWinnersHTML = lastJackpotsInfo.map((jackpot) => (
      <div key={jackpot.docId} style={{ width: 20, height: 20 }}>
        <img src={jackpot.winningBetRef?.userInfo.avatar} width={'100%'} />
      </div>
    ));
    setLastWinners(lastWinnersHTML);
  }, [lastJackpotsInfo]);

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
      <styles.RoundsContainer>
        {lastJackpotsInfo.length > 0 ? lastWinners : skeletonLastWinnersHTML}
      </styles.RoundsContainer>
    </styles.LastWinnersContainer>
  );
}
