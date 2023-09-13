import React, { useEffect, useState } from 'react';

import * as styles from './styles';

import { TGetJackpotResponse } from '../../config/interfaces/IGQLResponses';
import Wheel from '../../components/Elements/Games/Jackpot/Wheel';
import useGetJackpot from '../../hooks/useGetJackpot';
import MakeBet from '../../components/Elements/Games/Jackpot/MakeBet';
import Bets from '../../components/Elements/Games/Jackpot/Bets';
import Timer from '../../components/Elements/Games/Jackpot/Timer/Timer';

export default function Jackpot() {
  const [jackpotState, setJackpotState] = useState<TGetJackpotResponse>({
    bets: [],
    createdAt: 0,
    docId: '',
    jackpotDuration: 0,
    jackpotAnimationDuration: 0,
    prizePool: 0,
    status: 'ACTIVE',
    type: 'JACKPOT',
  });
  const { jackpotInfo, refetch } = useGetJackpot();

  const betsProps = {
    bets: jackpotState ? jackpotState.bets : [],
    prizePool: jackpotState ? jackpotState.prizePool : 0,
  };

  useEffect(() => {
    if (jackpotInfo) setJackpotState(jackpotInfo);
  }, [jackpotInfo]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="main-wrapper">
      <styles.HeaderAndWheelContainer>
        <styles.HeaderContainer>
          <div>
            {jackpotInfo?.startedAt ? (
              <Timer
                startedAt={jackpotInfo?.startedAt}
                duration={jackpotInfo?.jackpotDuration}
              />
            ) : jackpotInfo?.jackpotDuration ? (
              <h2>{jackpotInfo.jackpotDuration / 1000}:00</h2>
            ) : (
              <h2>60:00</h2>
            )}
          </div>
          <div>
            <h2>Last winners</h2>
          </div>
        </styles.HeaderContainer>
        <Wheel jackpotInfo={jackpotState} />
      </styles.HeaderAndWheelContainer>

      <styles.MakeBetAndPlayersContainer>
        <MakeBet />
        <Bets props={betsProps} />
      </styles.MakeBetAndPlayersContainer>
    </div>
  );
}
