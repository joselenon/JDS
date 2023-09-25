import styled from 'styled-components';

interface IModalContainerProps {
  $show: 'true' | 'false';
}

export const ModalContainer = styled.div<IModalContainerProps>`
  display: ${({ $show }) => ($show === 'true' ? 'flex' : 'none')};
  position: fixed;
  justify-content: center;
  align-items: center;
  z-index: 10;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  padding: var(--default-pdn);
`;

export const ModalBackground = styled.div`
  z-index: 1;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);
`;

export const ModalContent = styled.div`
  z-index: 2;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
