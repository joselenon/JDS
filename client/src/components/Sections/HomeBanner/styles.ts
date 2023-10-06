import styled from 'styled-components';

export const BannerContainer = styled.div`
  display: grid;

  grid-template-areas: 'catchphrase catchphrase catchphrase bannerads';
  line-height: 40px;

  h3 {
    font-size: 1rem;
    text-align: center;
  }

  @media (max-width: 1000px) {
    & {
      grid-template-areas: 'bannerads';
    }
  }
`;

export const Catchphrase = styled.div`
  grid-area: catchphrase;
  text-shadow: 0px 0px 40px #5cb539;
  text-transform: uppercase;
  font-family: var(--bai-font);
  font-size: 1.5rem;
  font-style: italic;
  font-weight: 700 !important;
  line-height: 1.25rem;
  background: radial-gradient(circle, rgba(25, 191, 91, 1) 0%, rgba(0, 124, 49, 1) 100%);
  border-radius: var(--default-br) 0 0 var(--default-br);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;

  span {
    white-space: nowrap;
  }

  @media (max-width: 1000px) {
    & {
      display: none;
    }
  }
`;

export const Catch1 = styled.div`
  margin-right: 100px;
  color: #0f4b08;
`;

export const Catch2 = styled.div`
  margin-left: 100px;
  color: white;
`;

export const BannerAds = styled.div`
  padding: 10px;
  border-radius: 0 var(--default-br) var(--default-br) 0;
  grid-area: bannerads;
  background-color: var(--primary-color);
  display: flex;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 1000px) {
    & {
      border-radius: var(--default-br);
    }
  }
`;

export const Responsive = styled.div`
  width: 100%;

  @media (max-width: 500px) {
    scale: 0.7;
  }
`;

export const Versus = styled.span`
  font-family: var(--bai-font);
  color: white;
  opacity: 0.5;
`;
