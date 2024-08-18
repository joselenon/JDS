import React, { memo } from 'react';

import * as styles from './styles';

import { DefaultDivButton } from '../../../../../styles/GLOBAL_STYLES';
import useMakeBet from '../../../../../hooks/useMakeBet';
import Button from '../../../../Elements/Button';
import Form from '../../../../Elements/Form';
import ERROR_MSGS from '../../../../../config/constants/ERROR_MSGS';
import useGetBalance from '../../../../../hooks/useGetBalance';
import { useSelector } from 'react-redux';
import IReduxStore from '../../../../../config/interfaces/IReduxStore';
import { ICreateInput } from '../../../../../config/interfaces/IForm';

function MakeBet() {
  const userInfo = useSelector((state: IReduxStore) => state.auth.userInfo);
  const updatedBalance = useGetBalance();

  const handleMakeBet = useMakeBet();

  const validateInput = (value: number) => {
    if (!updatedBalance) {
      return { valid: false, errorMsg: ERROR_MSGS.SERVER_OFFLINE_MSG };
    }
    if (!userInfo) {
      return { valid: false, errorMsg: ERROR_MSGS.NOT_LOGGED };
    }
    if (value <= 0) {
      return { valid: false, errorMsg: ERROR_MSGS.GAMES.INVALID_AMOUNT_BET };
    }
    if (value > 0 && value > updatedBalance) {
      return { valid: false, errorMsg: ERROR_MSGS.GAMES.INSUFFICIENT_BALANCE };
    }
    return { valid: true, errorMsg: '' };
  };

  const makeBetInput: ICreateInput = {
    id: 'amountBet',
    label: 'Quantia',
    options: { type: 'number', defaultValue: 0, required: true },
    rhfConfig: {
      rhfValidationFn: (value) => validateInput(value), // Bet must be over 0 coins
    },
  };

  const makeBetButton = (
    <DefaultDivButton>
      <Button btnType="CTA" label="aposta" attributes={{ type: 'submit' }} />
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
