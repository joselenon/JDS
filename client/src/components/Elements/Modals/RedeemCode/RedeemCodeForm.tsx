import React from 'react';

import * as styles from './styles';

import Form from '../../Form';
import Button from '../../Button';
import useRedeemCode from '../../../../hooks/useRedeemCode';
import { ICreateInput } from '../../../../config/interfaces/IForm';

export default function RedeemCodeForm() {
  const handleRedeemCode = useRedeemCode();

  const validate = (arg: any) => {
    if (arg.length <= 0) {
      return { valid: false, errorMsg: 'Campo obrigatório' };
    }
    return { valid: true, errorMsg: '' };
  };

  const redeemCodeInput: ICreateInput = {
    id: 'code',
    type: 'text',
    label: '',
    required: true,
    validationFn: (arg) => validate(arg),
  };

  const redeemButton = (
    <styles.RedeemButtonContainer>
      <Button btnType="CTA" label="Resgatar" type="submit" />
    </styles.RedeemButtonContainer>
  );

  const form = (
    <Form
      axiosCallHook={handleRedeemCode}
      InputContainer={({ children }) => <div>{children}</div>}
      inputArray={[redeemCodeInput]}
      submitButton={redeemButton}
    />
  );

  return form;
}
