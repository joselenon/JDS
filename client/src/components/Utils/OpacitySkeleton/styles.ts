import styled, { keyframes } from 'styled-components';

const opacityAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
`;

interface ISkeletonCotainer {
  color?: string;
}

export const SkeletonCotainer = styled.div<ISkeletonCotainer>`
  background-color: ${(props) => (props ? props.color : '#cecece')};
  width: 100%;
  height: 100%;
  border-radius: var(--default-br);
  animation: ${opacityAnimation} 1s infinite;
`;
