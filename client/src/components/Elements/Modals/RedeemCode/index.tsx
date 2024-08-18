import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTicket } from '@fortawesome/free-solid-svg-icons';

import * as styles from './styles';

import Button from '../../Button';
import RedeemCodeForm from './RedeemCodeForm';
import { SectionTitle } from '../../../../styles/GLOBAL_STYLES';

export default function RedeemCode() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = (e: any) => {
    if (e.target.id === 'redeem' || e.target.id === 'modal-background') {
      setModalOpen(!modalOpen);
    }
  };

  return (
    <div>
      <div style={{ width: 37 }}>
        <Button
          label={<FontAwesomeIcon icon={faPlus} />}
          btnType="CTA"
          attributes={{ id: 'redeem', onClick: toggleModal }}
        />
      </div>
      {modalOpen && (
        <styles.ModalContainer id="modal-background" onClick={(e) => toggleModal(e)}>
          <styles.ModalContent>
            <styles.HeaderContainer>
              <FontAwesomeIcon icon={faTicket} />
              <SectionTitle>Resgatar Código</SectionTitle>
            </styles.HeaderContainer>
            <RedeemCodeForm />
          </styles.ModalContent>
        </styles.ModalContainer>
      )}
    </div>
  );
}
