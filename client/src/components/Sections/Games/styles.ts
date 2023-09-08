import styled from 'styled-components';

export const GamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const GamesItemsContainer = styled.div`
  user-select: none;
  display: grid;
  grid-template-areas: 'jackpot jackpot papumtey papumtey';
  gap: 2rem;

  .jackpot {
    grid-area: jackpot;
  }
  .papumtey {
    grid-area: papumtey;
  }

  @media (max-width: 700px) {
    grid-template-areas:
      'jackpot jackpot'
      'papumtey papumtey';
  }
`;

export const GameItemContainer = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: var(--default-br);
  background-color: #ba2823;
  margin: 0 auto;
  box-shadow: 0px 2px 7px 1px rgb(0, 0, 0, 0.7);
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
    background-image: linear-gradient(0, #9c5102, #ff8400);
  }
`;

export const JackpotWheelImg = styled.img`
  position: absolute;
  z-index: 2;
  transform: translate(-7%, 90%);
  top: 4px;
  left: 0;
`;

export const Vignette = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.9) inset;
  z-index: 1;
`;

export const ComingSoon = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.4);
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  h2 {
    font-family: 'Gotham', sans-serif;
    font-size: 15px;
    padding: 15px;
    color: white;
  }
`;
