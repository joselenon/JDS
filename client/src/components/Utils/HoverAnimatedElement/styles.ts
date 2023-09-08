import styled from 'styled-components';

export const Container = styled.div`
  -webkit-backface-visibility: hidden;
  border-radius: var(--default-br);
  position: relative;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-out;
  box-shadow: 0px 2px 3px rgb(0, 0, 0, 0.6);

  &:hover {
    transform: translateY(-4px);
  }
`;
