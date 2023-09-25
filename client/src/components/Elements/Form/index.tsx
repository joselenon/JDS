import React, { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../Input';
import { ICreateInput } from '../../../config/interfaces/IInput';
import { AxiosResponse } from 'axios';
import IResponses from '../../../config/interfaces/IHTTPResponses';
import { toast } from 'react-toastify';

interface Props {
  // Function that will be used when form submits
  axiosCallHook: (
    payload: any,
  ) =>
    | Promise<AxiosResponse<IResponses<any> | any> | undefined>
    | Promise<IResponses<any> | any>;
  // In order to have custom style on inputs container
  InputContainer: React.ComponentType<{ children: React.ReactNode }>;
  inputArray: ICreateInput[];
  submitButton: JSX.Element;
}

export default function Form(props: Props) {
  const { axiosCallHook, InputContainer, inputArray, submitButton } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmitHandler: SubmitHandler<FieldValues> = async (info) => {
    console.log('submit');
    const res = await axiosCallHook({ ...info });
    if (res?.status === 200) toast.success(res.data.message);
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
      defaultValue={input.defaultValue}
      errorMsg={input.errorMsg}
      required={input.required}
      label={input.label}
      rhfValidate={input.validationFn}
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
