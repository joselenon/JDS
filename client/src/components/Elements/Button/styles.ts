import styled from 'styled-components';

export const Button = styled.button`
  font-family: 'Chakra Petch', sans-serif !important;
  font-weight: 900 !important;
  color: white !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  border: none !important;
  border-radius: var(--default-br) !important;
  gap: 0.25rem !important;

  &:hover {
    filter: brightness(0.95) !important;
  }

  &:active {
    box-shadow: none !important;
    transform: translateY(1px) !important;
  }
`;

interface IPageSelectButtons {
  $highlights: { returnHighlight: boolean; nextHighlight: boolean };
}

export const PageSelectButtons = styled.div<IPageSelectButtons>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
  color: white;

  button {
    font-size: 14px;
  }

  #return {
    color: ${({ $highlights }) =>
      $highlights.returnHighlight ? 'white' : '#cecece'} !important;
  }

  #next {
    color: ${({ $highlights }) =>
      $highlights.nextHighlight ? 'white' : '#cecece'} !important;
  }
`;
