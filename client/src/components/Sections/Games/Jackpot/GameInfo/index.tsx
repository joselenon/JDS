import React from 'react';

import * as styles from './styles';

import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';

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
    const winnerBetStyle =
      gameInfo.ticketDrawn &&
      gameInfo.ticketDrawn?.ticket > bet.intervals[0] &&
      gameInfo.ticketDrawn?.ticket < bet.intervals[1]
        ? { background: 'rgb(58, 122, 218, 0.3)' }
        : {};

    return (
      <styles.BetTR key={bet.docId} style={winnerBetStyle}>
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

      <styles.TicketDrawnAndPrizePool>
        <div>
          <h2>T. Sorteado</h2>
          <h1 style={{ color: 'var(--blue-color)' }}>
            {gameInfo.ticketDrawn ? gameInfo.ticketDrawn.ticket : 0}
          </h1>
        </div>
        <div>
          <h2>Pot</h2>
          <h1 style={{ color: 'var(--green-color)' }}>{gameInfo.prizePool}</h1>
        </div>
      </styles.TicketDrawnAndPrizePool>

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
