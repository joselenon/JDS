import React from 'react';

import * as styles from './styles';

import IInput from '../../../config/interfaces/IInput';

export default function Input(props: IInput) {
  // rhf - React Hook Form
  const {
    id,
    label,
    type,
    defaultValue,
    required = true,
    errorMsg,
    rhfRegister,
    rhfErrors,
    rhfValidate = () => true,
  } = props;

  return (
    <styles.InputContainer>
      <h3>{label}</h3>
      <label htmlFor={id}>
        <input
          type={type}
          defaultValue={defaultValue}
          {...rhfRegister(id, {
            valueAsNumber: type === 'number' ? true : false,
            validate: (value) => rhfValidate(value),
          })}
          required={required}
          aria-invalid={rhfErrors[id] ? 'true' : 'false'}
        />
        {rhfErrors[id] && rhfErrors[id]!.type === 'required' && (
          <styles.ErrorMessage>Campo obrigatório.</styles.ErrorMessage>
        )}
        {rhfErrors[id] && rhfErrors[id]!.type === 'validate' && (
          <styles.ErrorMessage>{errorMsg}</styles.ErrorMessage>
        )}
      </label>
    </styles.InputContainer>
  );
}
