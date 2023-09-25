import { UseFormRegister } from 'react-hook-form/dist/types/form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

export default interface IInput {
  id: string;
  type: 'number' | 'text';
  defaultValue?: string | number;
  label: string;
  required: boolean;
  errorMsg: string;
  rhfRegister: UseFormRegister<FieldValues>;
  rhfErrors: FieldErrors;
  rhfValidate?: (value: any) => boolean;
}

export interface ICreateInput {
  id: IInput['id'];
  type: 'number' | 'text';
  defaultValue?: IInput['defaultValue'];
  label: IInput['label'];
  required: boolean;
  errorMsg: string;
  validationFn?: (...args: any) => boolean;
}
