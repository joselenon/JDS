import styled from 'styled-components';

export const FooterContainer = styled.div`
  background-color: var(--primary-color);
  width: 100%;
  min-height: 250px;
  padding: 25px 10px;
`;

export const FooterWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FirstSectionContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas: 'ultimosSorteios termosESuporte redesSociais';
  gap: 1.5rem;

  .links {
    grid-area: links;
    width: 150px;
  }
  .ultimosSorteios {
    grid-area: ultimosSorteios;
    max-width: 400px;
  }
  .suporte {
    grid-area: termosESuporte;
  }
  .redesSociais {
    grid-area: redesSociais;
  }

  @media (max-width: 1000px) {
    grid-template-areas:
      'ultimosSorteios ultimosSorteios'
      'termosESuporte redesSociais';
  }
`;

export const FooterTab = styled.div`
  display: flex;
  flex-direction: column;
  color: white;

  h3 {
    font-size: 14px;
    white-space: nowrap;
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    color: var(--secondary-text-color);
    line-height: 20px;
    max-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    transition: all 0.2s;
  }

  p {
    &:hover {
      color: white;
    }
  }
`;

export const SocialsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;

  a {
    display: flex;
    background-color: #111111;
    border-radius: var(--default-br);
    padding: 4px;
  }

  svg {
    width: 18px;
    height: 18px;

    &.twitter {
      color: white;
    }
    &.twitch {
      color: #9653c9;
    }
    &.youtube {
      color: #c4302b;
    }
    &.instagram {
      color: #b33e98;
    }
    &.telegram {
      color: #3aa6c9;
    }
  }
`;

export const SecondSectionContainer = styled.div`
  color: white;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
