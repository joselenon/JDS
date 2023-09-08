import styled from 'styled-components';

export const GiveawayItem = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  gap: 1rem;

  img {
    border: 1px solid rgb(255, 255, 255, 0.1);
    object-fit: cover;
    min-width: 90px;
    max-width: 90px;
    height: 45px;
    border-radius: var(--default-br);
  }

  &:hover {
    p {
      color: white;
    }
  }
`;
