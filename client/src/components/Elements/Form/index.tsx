import React, { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../Input';
import { IFormProps } from '../../../config/interfaces/IForm';
import { AxiosResponse } from 'axios';
import IResponses from '../../../config/interfaces/IHTTPResponses';

export default function Form(props: IFormProps) {
  const { axiosCallHook, InputContainer, inputArray, submitButton } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmitHandler: SubmitHandler<FieldValues> = async (info) => {
    (await axiosCallHook({ ...info })) as
      | AxiosResponse<IResponses<unknown>, any>
      | undefined;
  };

  useEffect(() => {
    inputArray.forEach((input) => {
      if (input.defaultValue) setValue(input.id, input.defaultValue);
    });
  }, [setValue, inputArray]);

  const inputArrayHTML = inputArray.map((input) => (
    <Input
      key={input.id}
      type={input.type}
      id={input.id}
      multiple={input.multiple}
      defaultValue={input.defaultValue}
      required={input.required}
      label={input.label}
      validationFn={input.validationFn}
      rhfRegister={register}
      rhfErrors={errors}
    />
  ));

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
      <InputContainer>{inputArrayHTML}</InputContainer>
      {submitButton}
    </form>
  );
}
