import React, { memo, useState } from 'react';

import * as styles from './styles';

import { ICreateInput } from '../../../../../config/interfaces/IInput';
import { DefaultDivButton } from '../../../../../styles/GLOBAL_STYLES';
import useMakeBet from '../../../../../hooks/useMakeBet';
import Button from '../../../../Elements/Button';
import Form from '../../../../Elements/Form';
import ERROR_MSGS from '../../../../../config/constants/ERROR_MSGS';
import useGetBalance from '../../../../../hooks/useGetBalance';
import { useSelector } from 'react-redux';
import IReduxStore from '../../../../../config/interfaces/IReduxStore';

function MakeBet() {
  const userInfo = useSelector((state: IReduxStore) => state.auth.userInfo);
  const updatedBalance = useGetBalance();

  const [errorMsg, setErrorMsg] = useState('');
  const handleMakeBet = useMakeBet();

  const validateInput = (value: number) => {
    if (!userInfo) {
      setErrorMsg(ERROR_MSGS.GAMES.NOT_LOGGED);
      return false;
    }
    if (value <= 0) {
      setErrorMsg(ERROR_MSGS.GAMES.INVALID_AMOUNT_BET);
      return false;
    }
    if (value > 0 && value > updatedBalance) {
      setErrorMsg(ERROR_MSGS.GAMES.INSUFFICIENT_BALANCE);
      return false;
    }
    return true;
  };

  const makeBetInput: ICreateInput = {
    id: 'amountBet',
    label: 'Quantia',
    type: 'number',
    defaultValue: 0,
    required: true,
    errorMsg,
    validationFn: (value) => validateInput(value), // Bet must be over 0 coins
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

export default memo(MakeBet);
