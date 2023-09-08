import styled from 'styled-components';

export const LogoContainer = styled.div`
  user-select: none;
  text-shadow: 0px 0px 80px red;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 7px;
`;

export const SaulloContainer = styled.div`
  font-family: var(--chakra-font);
  line-height: 100%;
  font-weight: 700;
  font-size: 35px !important;
  font-style: italic;
  position: relative;
`;

export const SAULLOText = styled.span`
  font-family: var(--chakra-font);
  line-height: 100%;
  font-weight: 700;
  font-size: 35px !important;
  color: red;
  font-style: italic;
  position: relative;
`;

export const JogosDoContainer = styled.div`
  position: absolute;
  top: -1px;
  left: 50%;
  display: flex;
  transform: translate(-50%, -50%);

  span {
    font-family: var(--bai-font);
    font-size: 8.5px !important;
    font-weight: 700;
    letter-spacing: 6px;
    opacity: 1;
  }
`;

export const JDContainer = styled.div`
  position: absolute;
  top: -1px;
  left: 50%;
  display: flex;
  transform: translate(-148%, -35%) rotate(322deg);

  span {
    font-family: var(--bai-font);
    font-size: 5px !important;
  }
`;

export const JText = styled.span`
  top: -1px;
  left: 50%;
  display: flex;
`;

export const DText = styled.span`
  top: -1px;
  left: 50%;
  display: flex;
`;
