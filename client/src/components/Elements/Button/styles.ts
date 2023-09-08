import styled from 'styled-components';

interface Props {
  $styleConfig: {
    padding: { x: number; y: number };
    colors: { color: string; shadow_color: string };
  };
}

export const Button = styled.button<Props>`
  background-color: ${(props) => props.$styleConfig.colors.color};
  box-shadow: inset 0px -3px 0px ${(props) => props.$styleConfig.colors.shadow_color};
  font-family: 'Chakra Petch', sans-serif;
  font-weight: 900;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: var(--default-br);
  gap: 0.25rem;
  padding: ${(props) =>
    `${props.$styleConfig.padding.y}px ${props.$styleConfig.padding.x}px`};

  &:hover {
    filter: brightness(0.95);
  }

  &:active {
    box-shadow: none;
    transform: translateY(1px);
  }
`;
