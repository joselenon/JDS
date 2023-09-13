import React, { useState } from 'react';

import * as styles from './styles';

import { IBet } from '../../../../../config/interfaces/IBet';
import Button from '../../../Button';
import OpacitySkeleton from '../../../../Utils/OpacitySkeleton';

interface IBetsProps {
  props: { bets: IBet[]; prizePool: number };
}

export default function Bets(props: IBetsProps) {
  const [chunkPage, setChunkPage] = useState(0);
  const { bets, prizePool } = props.props;

  const betsOrdered = [...bets];
  betsOrdered.sort((bet1, bet2) => bet2.amountBet - bet1.amountBet);

  const chunkSize = 12;
  const chunks = [];
  for (let i = 0; i < betsOrdered.length; i += chunkSize) {
    const chunk = betsOrdered.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  const betsHTML =
    chunks.length > 0 &&
    chunks[chunkPage].map((bet) => {
      const betInfo = (
        <styles.BetInfo
          onMouseEnter={(e) => {
            e.currentTarget.classList.add('show');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.classList.remove('show');
          }}
        >
          <div>
            <h2 style={{ color: 'red' }}>Nick</h2>
            <h2>{`${bet.userInfo.username}`}</h2>
          </div>
          <div>
            <h2 style={{ color: 'red' }}>Tickets</h2>
            <h2>{`${bet.intervals[0]} - ${bet.intervals[1]}`}</h2>
          </div>
        </styles.BetInfo>
      );

      return (
        <styles.BetContainer key={bet.docId}>
          {betInfo}
          <img src={bet.userInfo.avatar} />
          <h2 style={{ color: '#00963b' }}>{`${(
            (bet.amountBet / prizePool) *
            100
          ).toFixed(2)}%`}</h2>
        </styles.BetContainer>
      );
    });

  const skeletonBetsHTML = [];
  for (let i = 0; i < 3; i++) {
    skeletonBetsHTML.push(
      <styles.BetSkeletonContainer>
        <div style={{ width: '70px', height: '70px' }}>
          <OpacitySkeleton color="#b1b1b1" />
        </div>
        <div style={{ width: '40px', height: '20px' }}>
          <OpacitySkeleton color="#b1b1b1" />
        </div>
      </styles.BetSkeletonContainer>,
    );
  }

  return (
    <div>
      <styles.BetsContainer>
        {betsHTML ? betsHTML : skeletonBetsHTML}
      </styles.BetsContainer>
      <styles.PageButtons>
        <Button
          btnType="DEFAULT"
          label={'<'}
          onClickFn={() => setChunkPage(chunkPage > 0 ? chunkPage - 1 : chunkPage)}
        />
        <Button
          btnType="DEFAULT"
          label=">"
          onClickFn={() =>
            setChunkPage(chunkPage + 1 === chunks.length ? chunkPage : chunkPage + 1)
          }
        />
      </styles.PageButtons>
    </div>
  );
}
