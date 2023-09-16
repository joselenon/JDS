import React from 'react';

import * as styles from './styles';

import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';
import PrizePool from '../PrizePool';

interface IGameInfoProps {
  gameInfo: TGetJackpotResponse;
}

export default function GameInfo({ gameInfo }: IGameInfoProps) {
  const createdAtNumber =
    typeof gameInfo.createdAt === 'string'
      ? parseInt(gameInfo.createdAt)
      : gameInfo.createdAt;

  const createdAt = new Date(createdAtNumber).toLocaleString();

  const betsHTML = gameInfo.bets.map((bet) => {
    return (
      <styles.BetTR key={bet.docId}>
        <styles.BetTD>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <img src={bet.userInfo.avatar} width={20} />
            <span>{bet.userInfo.username}</span>
          </div>
        </styles.BetTD>

        <styles.BetTD>
          <span>{bet.amountBet}</span>
        </styles.BetTD>

        <styles.BetTD style={{ whiteSpace: 'nowrap' }}>
          <span>{`${bet.intervals[0]} - ${bet.intervals[1]}`}</span>
        </styles.BetTD>
      </styles.BetTR>
    );
  });

  return (
    <styles.GameInfoContainer>
      <styles.GameInfoHeaderContainer>
        <h3>{`${createdAt}`}</h3>
        <h3>{`ID: ${gameInfo.docId}`}</h3>
      </styles.GameInfoHeaderContainer>

      <hr style={{ width: '100%', border: '1px solid #303030' }}></hr>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h2>Ticket Vencedor</h2>
          <h2>{`${gameInfo.winningBetRef?.intervals[0]} - ${gameInfo.winningBetRef?.intervals[1]}`}</h2>
        </div>
        <PrizePool prizePool={gameInfo.prizePool} />
      </div>

      <styles.BetsTable>
        <thead>
          <tr>
            <styles.BetTD>
              <h3>Nick</h3>
            </styles.BetTD>
            <styles.BetTD>
              <h3>Aposta</h3>
            </styles.BetTD>
            <styles.BetTD>
              <h3>Tickets</h3>
            </styles.BetTD>
          </tr>
        </thead>
        <tbody>{betsHTML}</tbody>
      </styles.BetsTable>
    </styles.GameInfoContainer>
  );
}
