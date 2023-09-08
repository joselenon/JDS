import styled, { keyframes } from 'styled-components';

const opacityAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

export const SkeletonCotainer = styled.div`
  background-color: #cecece;
  width: 100%;
  height: 100%;
  border-radius: var(--default-br);
  animation: ${opacityAnimation} 1s infinite;
`;
