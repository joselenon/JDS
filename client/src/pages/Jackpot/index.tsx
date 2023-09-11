import React, { useEffect, useState } from 'react';

import * as styles from './styles';

import { TGetJackpotResponse } from '../../config/interfaces/IGQLResponses';
import Wheel from '../../components/Elements/Games/Jackpot/Wheel';
import useGetJackpot from '../../hooks/useGetJackpot';
import MakeBet from '../../components/Elements/Games/Jackpot/MakeBet';
import Players from '../../components/Elements/Games/Jackpot/Players';

export default function Jackpot() {
  const [jackpotState, setJackpotState] = useState<TGetJackpotResponse | undefined>(
    undefined,
  );
  const { jackpotInfo, refetch } = useGetJackpot();

  const wheelProps = {
    jackpotInfo: jackpotState,
    status: jackpotState ? jackpotState.status : 'ACTIVE',
    bets: jackpotState ? jackpotState.bets : [],
    prizePool: jackpotState ? jackpotState.prizePool : 0,
    winningBetRef: jackpotState ? jackpotState.winningBetRef : undefined,
  };

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
      <h2 style={{ textAlign: 'end' }}>
        Pot: {`${jackpotState && jackpotState.prizePool ? jackpotState.prizePool : 0}`}
      </h2>
      <Wheel props={wheelProps} />
      <styles.MakeBetAndPlayersContainer>
        <MakeBet />
        <Players props={betsProps} />
      </styles.MakeBetAndPlayersContainer>
    </div>
  );
}
