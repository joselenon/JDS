import styled from 'styled-components';

export const ModalContainer = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(0, 0, 0, 0.5);
`;

export const ModalContent = styled.div`
  min-width: 300px;
  box-shadow: 0px 0px 5px black;
  background-color: var(--primary-color);
  border-radius: var(--default-br);
  padding: var(--default-pdn);
`;

export const FormContentContainer = styled.div``;

export const RedeemButtonContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  button {
    width: 100%;
  }
  svg {
    pointer-events: none;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;
