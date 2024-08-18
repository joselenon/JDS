// Arrumar input que ao colocar como vazio e ir para outra aba, ao voltar ele retorna o valor desatualizado
import React from 'react';
import validator from 'validator';

import * as styles from './styles';

import Button from '../../Elements/Button';
import useUpdateUserInfo from '../../../hooks/useUpdateUserInfo';
import Form from '../../Elements/Form';
import { ICreateInput } from '../../../config/interfaces/IForm';
import { useUserInfoContext } from '../../../contexts/UserProfileInfoContext';

export default function InfoForm() {
  const userInfo = useUserInfoContext();
  const handleUpdateUserInfo = useUpdateUserInfo();

  const validateEmail = (value: string) => {
    if (!validator.isEmail(value) && value.length !== 0) {
      return { valid: false, errorMsg: 'E-mail inválido.' };
    }
    return { valid: true, errorMsg: '' };
  };

  const emailInput: ICreateInput = {
    id: 'email',
    options: {
      type: 'text',
      defaultValue: userInfo?.email?.value,
      required: false,
      //disabled: userInfo?.email?.value ? true : false,
    },
    label: 'E-mail',
    rhfConfig: { rhfValidationFn: (value: string) => validateEmail(value) },
  };

  const tradeLinkInput: ICreateInput = {
    id: 'tradeLink',
    options: { type: 'text', defaultValue: userInfo?.tradeLink, required: false },
    label: 'Trade-Link',
  };

  const saveButton = (
    <styles.SaveButtonContainer>
      <div>
        <Button btnType="CTA" label="Salvar" attributes={{ type: 'submit' }} />
      </div>
    </styles.SaveButtonContainer>
  );

  return (
    <styles.FormContainer>
      <Form
        axiosCallHook={handleUpdateUserInfo}
        InputContainer={styles.InputsContainer}
        inputArray={[emailInput, tradeLinkInput]}
        submitButton={saveButton}
      />
    </styles.FormContainer>
  );
}
