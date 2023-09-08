import React, { useEffect, useState } from 'react';

import Wheel from '../../components/Elements/Games/Jackpot/Wheel';
import useGetJackpot from '../../hooks/useGetJackpot';
import { TGetJackpotResponse } from '../../config/interfaces/IGQLResponses';
import MakeBet from '../../components/Elements/MakeBet';

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

  useEffect(() => {
    if (jackpotInfo) setJackpotState(jackpotInfo);
  }, [jackpotInfo]);

  useEffect(() => {
    refetch();
    console.log('jack aqui', jackpotInfo);
  }, []);

  return (
    <div className="main-wrapper">
      <h2 style={{ textAlign: 'end' }}>
        Pot: {`${jackpotState && jackpotState.prizePool ? jackpotState.prizePool : 0}`}
      </h2>
      <Wheel props={wheelProps} />
      <MakeBet />
    </div>
  );
}
