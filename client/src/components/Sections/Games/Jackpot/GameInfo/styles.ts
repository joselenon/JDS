import styled from 'styled-components';

export const GameInfoContainer = styled.div`
  max-width: 350px;
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  padding: var(--default-pdn);
  border-radius: var(--default-br);
  background-color: var(--primary-color);
  gap: 0.5rem;

  h1 {
    font-size: 30px;
    line-height: 23px;
    text-align: center;
  }

  h2 {
    color: white;
    text-align: center;
    white-space: nowrap;
    line-height: 20px;
    font-size: 14px !important;
  }

  hr {
    width: 100% !important;
    border: 1px solid #303030 !important;
    border-radius: var(--default-br);
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
    font-size: 12px;

    &:hover {
      color: white;
    }
  }
`;

export const TicketDrawnAndPrizePool = styled.div`
  user-select: none;
  width: 100%;
  display: flex;
  justify-content: space-around;
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
    height: 20px;
  }
`;

export const BetTD = styled.td`
  padding: 5px 10px;

  span {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
    font-size: 16px;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;
