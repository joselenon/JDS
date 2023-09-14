import styled from 'styled-components';

export const HeaderAndWheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MakeBetAndPlayersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1.5rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
