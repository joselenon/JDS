import React from 'react';

import * as styles from './styles';

import { ICreateInput } from '../../../config/interfaces/IInput';
import { DefaultDivButton } from '../../../styles/GLOBAL_STYLES';
import Button from '../Button';
import Form from '../Form';
import useMakeBet from '../../../hooks/useMakeBet';

export default function MakeBet() {
  const handleMakeBet = useMakeBet();
  const makeBetInput: ICreateInput = {
    id: 'amount',
    label: 'Quantia',
    type: 'number',
    defaultValue: 0,
    validationFn: (value) => value > 0, // Bet must be over 0 coins
  };

  const makeBetButton = (
    <DefaultDivButton>
      <Button btnType="CTA" label="aposta" type="submit" />
    </DefaultDivButton>
  );
  return (
    <styles.MakeBetContainer>
      <Form
        axiosCallHook={handleMakeBet}
        inputArray={[makeBetInput]}
        InputContainer={styles.InputContainer}
        submitButton={makeBetButton}
      />
    </styles.MakeBetContainer>
  );
}
