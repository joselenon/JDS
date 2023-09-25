import React from 'react';

import * as styles from './styles';

interface IModalProps {
  children: JSX.Element;
  showModal: boolean;
  toggleModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Modal({ children, showModal, toggleModal }: IModalProps) {
  return (
    <styles.ModalContainer $show={showModal ? 'true' : 'false'}>
      <styles.ModalBackground onClick={() => toggleModal()} />
      <styles.ModalContent>{children}</styles.ModalContent>
    </styles.ModalContainer>
  );
}
