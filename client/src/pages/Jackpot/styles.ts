import styled from 'styled-components';

export const MakeBetAndPlayersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1.5rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
