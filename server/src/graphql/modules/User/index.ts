import { responseBody } from '../../../helpers/responseHelpers';
import { PSub, PUBSUB_EVENTS } from '../../pubSubConfig';
import IGQLContext from '../../../config/interfaces/IGQLContext';
import validateAndCaptureError from '../../../common/validateAndCaptureError';

import pSubEventHelper from '../../../helpers/pSubEventHelper';
import BalanceService from '../../../services/BalanceService';
import { DocumentNotFoundError } from '../../../config/errors/classes/SystemErrors';

const resolvers = {
  Query: {
    getUser: async (_: any, __: any, context: IGQLContext) => {
      try {
        const { validateAuth, jwtToken, UserController } = context;
        const { validatedJWTPayload } = await validateAuth(jwtToken);

        const userData = await UserController.getUser(
          validatedJWTPayload.userDocId,
        );

        if (!userData) throw new DocumentNotFoundError();

        return responseBody(true, 'GET_MSG', userData.result);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },

    getBalance: async (_: any, args: any, context: IGQLContext) => {
      try {
        const { validateAuth, jwtToken } = context;
        const { validatedJWTPayload } = await validateAuth(jwtToken);

        const balance = await BalanceService.getBalance(
          validatedJWTPayload.userDocId,
        );
        pSubEventHelper(
          'GET_LIVE_BALANCE',
          'getLiveBalance',
          { success: true, message: 'GET_MSG', data: balance },
          validatedJWTPayload.userDocId,
        );

        return responseBody(true, 'GET_MSG', balance);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },
  },

  Subscription: {
    getLiveBalance: {
      subscribe: async (_: any, args: any, context: IGQLContext) => {
        try {
          const { validateAuth, jwtToken } = context;
          const { validatedJWTPayload } = await validateAuth(jwtToken);

          return PSub.asyncIterator([
            `${PUBSUB_EVENTS.GET_LIVE_BALANCE.triggerName}:${validatedJWTPayload.userDocId}`,
          ]);
        } catch (err) {
          console.log('Erro aqui', err);
          validateAndCaptureError(err);
        }
      },
    },
  },
};

export default resolvers;
