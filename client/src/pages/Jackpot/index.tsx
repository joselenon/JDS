import React from 'react';

import * as styles from './styles';

import { DEFAULT_JACKPOT_STATE } from '../../config/constants/DEFAULT_JACKPOT_STATE';
import useGetJackpot from '../../hooks/useGetJackpot';
import Wheel from '../../components/Sections/Games/Jackpot/Wheel';
import MakeBet from '../../components/Sections/Games/Jackpot/MakeBet';
import Bets from '../../components/Sections/Games/Jackpot/Bets';
import LastJackpots from '../../components/Sections/Games/Jackpot/LastJackpots';
import useGetLastJackpots from '../../hooks/useGetLastJackpots';
import PrizePool from '../../components/Sections/Games/Jackpot/PrizePool';

export default function Jackpot() {
  const { lastJackpotsInfo } = useGetLastJackpots();
  const { jackpotInfo, refetch } = useGetJackpot();
  refetch && refetch();

  const betsProps = {
    bets: jackpotInfo ? jackpotInfo.bets : [],
    prizePool: jackpotInfo ? jackpotInfo.prizePool : 0,
  };

  return (
    <div className="main-wrapper">
      <styles.HeaderAndWheelContainer>
        <styles.HeaderContainer>
          <LastJackpots lastJackpotsInfo={lastJackpotsInfo ? lastJackpotsInfo : []} />
          <PrizePool prizePool={jackpotInfo ? jackpotInfo.prizePool : 0} />
        </styles.HeaderContainer>

        <Wheel jackpotInfo={jackpotInfo ? jackpotInfo : DEFAULT_JACKPOT_STATE} />
      </styles.HeaderAndWheelContainer>

      <styles.MakeBetAndPlayersContainer>
        <MakeBet />
        <Bets props={betsProps} />
      </styles.MakeBetAndPlayersContainer>
    </div>
  );
}
