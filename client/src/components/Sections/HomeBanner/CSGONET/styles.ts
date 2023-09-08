import styled from 'styled-components';

export const CSGONETContainer = styled.div`
  font-family: var(--bai-font);
  text-shadow: 0px 0px 80px #3a7ada;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  scale: 0.9;

  @media (max-width: 500px) {
    scale: 0.7;
  }
`;

export const Logo = styled.div`
  line-height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
`;

export const CSGONET = styled.span`
  font-weight: 700;
  font-size: 9px !important;
`;

export const UseOCupom = styled.span`
  line-height: 17px;
  font-size: 16px !important;
  font-weight: 700;
`;

export const Sonho = styled.span`
  line-height: 22px;
  font-weight: 700;
  font-size: 32px !important;
  color: #3a7ada;
`;

export const ParaBonus = styled.div`
  line-height: 16px;
  font-weight: 700;
  font-size: 10.5px !important;
`;
