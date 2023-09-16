import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import * as styles from './styles';

import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';
import OpacitySkeleton from '../../../../Utils/OpacitySkeleton';
import { DEFAULT_JACKPOT_STATE } from '../../../../../config/constants/DEFAULT_JACKPOT_STATE';
import GameInfo from '../GameInfo';

interface ILastWinnersProps {
  lastJackpotsInfo: TGetJackpotResponse[];
}

export default function LastJackpots({ lastJackpotsInfo }: ILastWinnersProps) {
  const [lastWinners, setLastWinners] = useState<JSX.Element[]>([]);
  const [selectedGameInfo, setSelectedGameInfo] =
    useState<TGetJackpotResponse>(DEFAULT_JACKPOT_STATE);

  useEffect(() => {
    const lastWinnersHTML = lastJackpotsInfo.map((jackpot) => (
      <styles.Game key={jackpot.docId} onClick={() => setSelectedGameInfo(jackpot)}>
        <img src={jackpot.winningBetRef?.userInfo.avatar} width={'100%'} />
      </styles.Game>
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
    <styles.LastJackpotsContainer>
      <h2>Last Winners</h2>
      <styles.GamesContainer>
        {lastJackpotsInfo.length > 0 ? lastWinners : skeletonLastWinnersHTML}
      </styles.GamesContainer>
      <GameInfo gameInfo={selectedGameInfo} />
    </styles.LastJackpotsContainer>
  );
}
