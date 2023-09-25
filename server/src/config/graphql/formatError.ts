// Format every GraphQL request error before send to client (Client is unable to read what happened)
import { GraphQLFormattedError } from 'graphql/error';
import { API_RESPONSE_MSGS } from '../constants/RESPONSES';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (err: GraphQLFormattedError) {
  /*   if (err.extensions && typeof err.extensions.stacktrace === 'string') {
    return {
      message: err.message,
      extensions: {
        code: err.extensions.stacktrace[0],
      },
    };
  } */

  return {
    message: API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.GENERIC_MSG,
    extensions: {
      code: 'UnexpectedError',
    },
  };
}
