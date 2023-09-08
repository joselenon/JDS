import React from 'react';

import * as styles from './styles';

import Form from '../../Form';
import { ICreateInput } from '../../../../config/interfaces/IInput';
import Button from '../../Button';
import useRedeemCode from '../../../../hooks/useRedeemCode';

export default function RedeemCodeForm() {
  const handleRedeemCode = useRedeemCode();

  const redeemCodeInput: ICreateInput = {
    id: 'code',
    type: 'text',
    label: '',
    validationFn: (arg) => arg.length > 0,
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
