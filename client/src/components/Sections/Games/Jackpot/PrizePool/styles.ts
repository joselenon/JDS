import styled from 'styled-components';

export const PotContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  h2 {
    font-size: 16px;
  }
`;

export const PotText = styled.h2`
  color: var(--green-color) !important;
  text-align: end;
  font-size: 30px !important;
  line-height: 24px;
`;
