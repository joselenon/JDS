import { UseFormRegister } from 'react-hook-form/dist/types/form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { AxiosResponse } from 'axios';
import IResponses from './IHTTPResponses';

export interface IFormProps {
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

/*
Captions
  axiosCallHook: used to pass hook responsible for sending the data do the server-side
  InputContainer: used to pass a father element to receive input elements (useful for customize styles). Prop Example: const DivContainer = ({children}) => <div className='example'>{children}</div>
  inputArray: used to pass all inputs that will be used by the form in one array
  submitButton: used to pass a custom styled button to the form
*/

export interface IInputRHF {
  id: ICreateInput['id'];
  type: ICreateInput['type'];
  multiple?: ICreateInput['multiple'];
  defaultValue?: ICreateInput['defaultValue'];
  label: ICreateInput['label'];
  required: ICreateInput['required'];
  rhfRegister: UseFormRegister<FieldValues>;
  rhfErrors: FieldErrors;
  validationFn?: ICreateInput['validationFn'];
}

export interface ICreateInput {
  id: string;
  type: 'number' | 'text' | 'file';
  multiple?: boolean;
  defaultValue?: string | number;
  label: string;
  required: boolean;
  validationFn?: (value: any) => { valid: boolean; errorMsg: string };
}

/*
Captions
  id: used as an identifier for RHF
  type: used to define input type
  multiple: used when input type is file and there's the option of uploading more than one file
  defaultValue: used to start the input with a specific value (for it to not start empty)
  label: used to create a "h3", with the value received, above the input]
  required: used to define if the input fill is required
  validationFn: used to validate input value before being sent (if there's any error, it sets and returns the message to 'errorMsg')
*/
