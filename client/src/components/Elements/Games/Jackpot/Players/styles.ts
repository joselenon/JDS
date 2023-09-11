import styled from 'styled-components';

export const PlayersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  flex-wrap: wrap;
  background-color: var(--secondary-color);
  padding: var(--default-pdn);
  border-radius: var(--default-br);

  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 550px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const Player = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    height: 70px;
    border-radius: var(--default-br);
    box-shadow: var(--default-bshadow);
  }
  h2 {
    font-size: 14px;
    max-width: 80px;
    color: var(--primary-color);
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
