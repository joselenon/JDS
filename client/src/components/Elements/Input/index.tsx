import React, { useState } from 'react';

import * as styles from './styles';

import { IInputRHF } from '../../../config/interfaces/IForm';

export default function Input(props: IInputRHF) {
  const [validationValue, setValidationValue] = useState({
    valid: false,
    errorMsg: '',
  });

  const {
    id,
    label,
    type,
    multiple,
    defaultValue,
    required = true,
    rhfRegister,
    rhfErrors,
    validationFn = () => {
      return {
        valid: true,
        errorMsg: '',
      };
    },
  } = props;

  const validation = (value: any) => {
    const validate = validationFn(value);
    console.log(validate);
    setValidationValue(validate);
    return validate;
  };

  // rhfRegister is responsible to set the payload keys with the id and the input submittion options (ex: validate)
  const { ...registerProps } = rhfRegister(id, {
    valueAsNumber: type === 'number',
    validate: (value) => {
      const { valid } = validation(value);
      return valid;
    },
  });

  return (
    <styles.InputContainer>
      <h3>{label}</h3>
      <label htmlFor={id}>
        {type === 'file' ? (
          <input
            type={type}
            id={id}
            multiple={multiple}
            defaultValue={defaultValue}
            {...registerProps}
            required={required}
            aria-invalid={rhfErrors[id] ? 'true' : 'false'}
          />
        ) : (
          <input
            type={type}
            defaultValue={defaultValue}
            {...registerProps}
            required={required}
            aria-invalid={rhfErrors[id] ? 'true' : 'false'}
          />
        )}

        {rhfErrors[id] && rhfErrors[id]!.type === 'required' && (
          <styles.ErrorMessage>Campo obrigatório.</styles.ErrorMessage>
        )}
        {rhfErrors[id] && rhfErrors[id]!.type === 'validate' && (
          <styles.ErrorMessage>{validationValue.errorMsg}</styles.ErrorMessage>
        )}
      </label>
    </styles.InputContainer>
  );
}
