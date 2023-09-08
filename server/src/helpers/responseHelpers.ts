import { API_RESPONSE_MSGS } from '../config/constants';

type TSuccessMessage = keyof typeof API_RESPONSE_MSGS.SUCCESS;

export const successResponse = (
  message: TSuccessMessage,
  data: any = null,
) => ({
  success: true,
  message: API_RESPONSE_MSGS.SUCCESS[message],
  data,
});

export const errorResponse = (message: string) => ({
  success: false,
  message: message,
});
