import validator from 'validator';

export default function validateEmail(email: string, allowBlank: boolean) {
  if (allowBlank && email === '') return true;
  return validator.isEmail(email);
}
