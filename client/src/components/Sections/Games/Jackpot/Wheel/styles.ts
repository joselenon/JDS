import styled, { keyframes } from 'styled-components';

export const WheelContainer = styled.div`
  width: 100%;
  user-select: none;
  overflow-x: hidden;
  position: relative;
  padding: var(--default-pdn) 0;
  border-radius: var(--default-br);
  background-color: var(--primary-color);
`;

export const slide = keyframes`
  0% {
    transform: translateX(-760px);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  100% {
    transform: translateX(-7320px);
    animation-timing-function: cubic-bezier(0.7, 0, 0.2, 1);
  }
`;

export const AvatarsContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 80px;
  left: 50%;
  transform: translateX(-760px); // -760px

  &.start {
    animation: ${slide} 4s linear forwards;
  }
`;

export const AvatarItemContainer = styled.div`
  width: 80px;
  height: 80px;
  border: 1.5px solid grey;

  img {
    width: 80px;
    height: 100%;
  }
`;

interface IWheelPointerProps {
  $jackpotFinished: boolean;
}

export const WheelPointer = styled.div<IWheelPointerProps>`
  position: absolute;
  z-index: 1;
  top: 0;
  left: calc(50%);
  width: 3px;
  height: 100%;
  background-color: red;
  transition: opacity 0.5ms;
  opacity: ${(props) => (props.$jackpotFinished ? 1 : 0)};
`;

interface IAbsoluteContainerProps {
  $jackpotStarted: boolean;
}

export const AbsoluteContainer = styled.div<IAbsoluteContainerProps>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
  background-color: ${(props) => (props.$jackpotStarted ? 'none' : 'rgb(0, 0, 0, 0.4)')};
  opacity: ${(props) => (props.$jackpotStarted ? 0 : 1)};

  span {
    font-size: 48px;
    color: white;
    font-weight: 800;
  }
`;

export const AguardandoApostasText = styled.span<IAbsoluteContainerProps>`
  text-transform: uppercase;
  font-size: 14px !important;
  letter-spacing: 3px;
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.$jackpotStarted ? 0 : 0.75)};
  font-family: var(--bai-font);
`;
