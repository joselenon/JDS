// Arrumar input que ao colocar como vazio e ir para outra aba, ao voltar ele retorna o valor desatualizado

import React from 'react';

import * as styles from './styles';

import Button from '../../Elements/Button';
import useUpdateUserInfo from '../../../hooks/useUpdateUserInfo';
import Form from '../../Elements/Form';
import useGetUserInfo from '../../../hooks/useGetUserInfo';
import { ICreateInput } from '../../../config/interfaces/IForm';

export default function InfoForm() {
  const userInfo = useGetUserInfo();
  const handleUpdateUserInfo = useUpdateUserInfo();

  const validateEmail = (value: string) => {
    if (!validateEmail(value) && value.length !== 0) {
      return { valid: false, errorMsg: 'E-mail inválido.' };
    }
    return { valid: true, errorMsg: '' };
  };

  const emailInput: ICreateInput = {
    id: 'email',
    type: 'text',
    defaultValue: userInfo?.email,
    label: 'E-mail',
    required: false,
    validationFn: (value: string) => validateEmail(value),
  };

  const tradeLinkInput: ICreateInput = {
    id: 'tradeLink',
    type: 'text',
    defaultValue: userInfo?.tradeLink,
    label: 'Trade-Link',
    required: false,
  };

  const saveButton = (
    <styles.SaveButtonContainer>
      <div>
        <Button btnType="CTA" label="Salvar" type={'submit'} />
      </div>
    </styles.SaveButtonContainer>
  );

  const form = (
    <Form
      axiosCallHook={handleUpdateUserInfo}
      InputContainer={styles.InputsContainer}
      inputArray={[emailInput, tradeLinkInput]}
      submitButton={saveButton}
    />
  );

  return <styles.FormContainer>{form}</styles.FormContainer>;
}
