import styled from 'styled-components';

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

export const GameText = styled.h1`
  position: absolute;
  z-index: 1;
  -webkit-background-clip: text;
  background-image: linear-gradient(0, #080808, #ffffff);
  color: transparent;
  font-size: 125px;
  top: 10px;
  left: -150px;
  transition: transform 0.2s ease-in-out;

  &.ppt {
  }
`;

export const JackpotWheelImg = styled.img`
  position: absolute;
  z-index: 2;
  transform: translate(-7%, 90%);
  top: 4px;
  left: 0;
`;
