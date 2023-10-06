import styled, { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    --chakra-font: 'Chakra Petch', sans-serif;
    --bai-font: 'Bai Jamjuree', sans-serif;
    --header-height: 70px;
    --default-red: #cb2626;
    --main-bg-color: #ebebeb;
    --primary-text-color: #212121;
    --primary-color: #212121;
    --secondary-color: #cecece;
    --green-color: #00963b;
    --blue-color: #3a7ada;
    --secondary-text-color: #d9d9d9;
    --default-br: 5px; // Border-radius
    --default-fs: 16px; // Font-size
    --mobile-fs: 12px; // Font-size
    --default-pdn: 15px; // Padding
    --default-bshadow: 0px 2px 3px rgb(0, 0, 0, 0.6); // Box-shadow
    --default-btn-mt: 8px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    ::-webkit-scrollbar {
      display: none;
  }
  }

  html{
    font-size: var(--default-fs);

    @media (max-width: 1000px) {
      font-size: var(--mobile-fs);
    }
  }

  body {
    font-family: 'Chakra Petch', sans-serif;
    background-color: var(--main-bg-color);
    color: white;
  }

  svg{
    pointer-events: none;
  }

  button {
    font-family: 'Chakra Petch', sans-serif;
    cursor: pointer;
    background: none;
    border: none;
    height: 37px;
  }

  input {
    border: none;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-clear-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  h2 {
    color: var(--primary-color);
  }

  h3 {
    font-size: 14px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .main-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 1300px;
    width: 100%;
    min-height: 80vh;
    margin: 0 auto;
    padding: 2rem 4vw;
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-color);
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  color: var(--secondary-text-color);
`;

export const Logo = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--main-bg-color);
  text-shadow: 0px 2px 0px red;
`;

export const SectionTitle = styled.h3`
  margin-bottom: 1rem;
`;

export const DefaultDivButton = styled.div`
  margin-top: var(--default-btn-mt);
`;
