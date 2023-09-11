import IGQLContext from '../../../config/interfaces/IGQLContext';
import validateAndCaptureError from '../../../common/validateAndCaptureError';
import { responseBody } from '../../../helpers/responseHelpers';
import { PSub, PUBSUB_EVENTS } from '../../pubSubConfig';

import pSubEventHelper from '../../../helpers/pSubEventHelper';
import BalanceService from '../../../services/BalanceService';

const resolvers = {
  Query: {
    getUser: async (_: any, __: any, context: IGQLContext) => {
      try {
        const { validateAuth, jwtToken, UserController } = context;
        const { userDocId } = await validateAuth(jwtToken);
        const userData = await UserController.getUser(userDocId);
        return responseBody(true, 'GET_MSG', userData?.body);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },
    getBalance: async (_: any, args: any, context: IGQLContext) => {
      try {
        const { validateAuth, jwtToken } = context;
        const { userDocId } = await validateAuth(jwtToken);
        const balance = await BalanceService.getBalance(userDocId);
        pSubEventHelper(
          'GET_LIVE_BALANCE',
          'getLiveBalance',
          { success: true, message: 'GET_MSG', data: balance },
          userDocId,
        );
        return responseBody(true, 'GET_MSG', balance);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },
  },

  Subscription: {
    getLiveBalance: {
      subscribe: async (_: any, args: any, context: any) => {
        try {
          const { validateAuth, jwtToken } = context;
          const { userDocId } = await validateAuth(jwtToken);
          if (!userDocId) return null;

          return PSub.asyncIterator([
            `${PUBSUB_EVENTS.GET_LIVE_BALANCE.triggerName}:${userDocId}`,
          ]);
        } catch (err) {
          validateAndCaptureError(err);
        }
      },
    },
  },
};

export default resolvers;
