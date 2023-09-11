import React from 'react';

import * as styles from './styles';

import { IBet } from '../../../../../config/interfaces/IBet';
import OpacitySkeleton from '../../../../Utils/OpacitySkeleton';
import RedSkeleton from '../../../../Utils/RedSkeleton';

interface IPlayersProps {
  props: { bets: IBet[]; prizePool: number };
}

export default function Players(props: IPlayersProps) {
  const { bets, prizePool } = props.props;

  const skeletonBetsHTML = () => {
    for (let i = 0; i < 3; i++) {
      return (
        <styles.Player key={'x'}>
          <div>
            <OpacitySkeleton />
          </div>
          <div style={{ height: '70px' }}>
            <RedSkeleton />
          </div>
          <h2>
            <OpacitySkeleton />
          </h2>
        </styles.Player>
      );
    }
  };

  const betsHTML = bets.map((bet) => {
    return (
      <styles.Player key={bet.docId}>
        <h2 style={{ color: 'green' }}>{`${((bet.amountBet / prizePool) * 100).toFixed(
          2,
        )}%`}</h2>
        <img src={bet.userInfo.avatar} />
        <h2> {bet.userInfo.username}</h2>
      </styles.Player>
    );
  });

  return (
    <styles.PlayersContainer>
      {betsHTML.length > 0 ? betsHTML : skeletonBetsHTML()}
    </styles.PlayersContainer>
  );
}
