// Arrumar input que ao colocar como vazio e ir para outra aba, ao voltar ele retorna o valor desatualizado

import React from 'react';

import * as styles from './styles';

import Button from '../../Elements/Button';
import useUpdateUserInfo from '../../../hooks/useUpdateUserInfo';
import validateEmail from '../../../common/validateEmail';
import { ICreateInput } from '../../../config/interfaces/IInput';
import Form from '../../Elements/Form';
import useGetUserInfo from '../../../hooks/useGetUserInfo';

export default function InfoForm() {
  const userInfo = useGetUserInfo();

  const handleUpdateUserInfo = useUpdateUserInfo();
  const emailInput: ICreateInput = {
    id: 'email',
    type: 'text',
    defaultValue: userInfo?.email,
    label: 'E-mail',
    errorMsg: 'E-mail inválido',
    required: false,
    validationFn: (value: string) => validateEmail(value, true),
  };

  const tradeLinkInput: ICreateInput = {
    id: 'tradeLink',
    type: 'text',
    defaultValue: userInfo?.tradeLink,
    label: 'Trade-Link',
    errorMsg: '',
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
