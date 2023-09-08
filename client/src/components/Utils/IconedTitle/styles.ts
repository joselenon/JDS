import styled from 'styled-components';

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  h2 {
    font-family: var(--chakra-font);
    font-size: 18px !important;
    text-transform: uppercase;
    color: var(--primary-color);
  }

  svg {
    width: 18px;
    color: var(--primary-color);
  }
`;
