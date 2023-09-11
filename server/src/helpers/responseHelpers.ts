import { API_RESPONSE_MSGS } from '../config/constants';

type TSuccessMessage = keyof typeof API_RESPONSE_MSGS.SUCCESS;
type TErrorMessage = keyof typeof API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS;
export type TMessages = TSuccessMessage | TErrorMessage;

const MESSAGES = {
  ...API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS,
  ...API_RESPONSE_MSGS.SUCCESS,
};

export const responseBody = (
  success: boolean,
  message: TMessages,
  data: any = null,
) => ({
  success: success,
  message: MESSAGES[message],
  data,
});

// Used at HTTP errors treatment middleware
export const errorResponse = (message: string) => ({
  success: false,
  message: message,
});
