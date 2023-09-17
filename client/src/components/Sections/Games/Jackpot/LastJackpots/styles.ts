import styled from 'styled-components';

export const LastJackpotsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h2 {
    font-size: 16px;
  }
`;

export const GamesContainer = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const Game = styled.div`
  cursor: pointer;
  display: flex;
  background-color: var(--secondary-color);
  border-radius: var(--default-br);
  padding: 3px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-color);
  }

  img {
    border-radius: var(--default-br);
    width: 20px;
  }
`;

export const GameInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: var(--default-pdn);
  border-radius: var(--default-br);
  background-color: var(--primary-color);
  gap: 0.5rem;

  h2 {
    font-size: 20px;
    color: white;
    white-space: nowrap;
  }
`;

export const GameInfoHeaderContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  h3 {
    color: var(--secondary-color);
    white-space: nowrap;

    &:hover {
      color: white;
    }
  }
`;

export const BetsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: var(--default-br);

  td:first-child,
  th:first-child {
    border-radius: var(--default-br) 0 0 var(--default-br);
  }

  td:last-child,
  th:last-child {
    border-radius: 0 var(--default-br) var(--default-br) 0;
  }
`;

export const BetTR = styled.tr`
  &:hover {
    background-color: #404040;
  }

  img {
    border-radius: var(--default-br);
    width: 20px;
  }

  h3 {
    max-width: 150px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

export const BetTD = styled.td`
  padding: 5px 10px;
`;
