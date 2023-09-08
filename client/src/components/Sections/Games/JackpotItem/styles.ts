import styled, { keyframes } from 'styled-components';

// Mathematically calculated
export const WheelGif = keyframes`
  0% {
    animation-timing-function: linear;
    transform: translate(-7%, 90%);
  }
  25% {
    animation-timing-function: linear;
    transform: translate(-25.13%, 90%);
  }
  50% {
    animation-timing-function: linear;
    transform: translate(-35%, 90%);
  }
  100% {
    animation-timing-function: linear;
    transform: translate(-79.55%, 90%);
  }
`;

export const Elements = styled.div`
  scale: 0.9;
  will-change: transform;
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%) rotate(-14deg);
  transition: transform 0.2s ease-in-out;
  top: 20%;
  left: 20%;

  &.hover {
    img {
      animation: ${WheelGif} 4s infinite;
    }
  }

  @media (max-width: 900px) {
    scale: 0.8;
  }
  @media (max-width: 700px) {
    scale: 0.9;
  }
  @media (max-width: 500px) {
    scale: 0.8;
  }
  @media (max-width: 350px) {
    scale: 0.65;
  }
`;
