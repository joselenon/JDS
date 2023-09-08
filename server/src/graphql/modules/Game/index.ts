import validateAndCaptureError from '../../../common/validateAndCaptureError';
import pSubEventHelper from '../../../helpers/pSubEventHelper';
import { successResponse } from '../../../helpers/responseHelpers';
import JackpotService from '../../../services/GamesServices/JackpotService';
import { PSub, PUBSUB_EVENTS } from '../../pubSubConfig';

const resolvers = {
  Query: {
    getJackpot: async (_: any, __: any, ___: any) => {
      try {
        const jackpot = await JackpotService.getJackpotInRedis();
        const jackpotObj = { ...jackpot, ...JackpotService.getConfig() };
        pSubEventHelper('GET_REDIS_JACKPOT', 'getLiveJackpot', jackpotObj);
        return successResponse('GET_MSG', jackpotObj);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },
  },

  Subscription: {
    getLiveJackpot: {
      subscribe: async (_: any, __: any) => {
        try {
          return PSub.asyncIterator([
            PUBSUB_EVENTS.GET_REDIS_JACKPOT.triggerName,
          ]);
        } catch (err) {
          validateAndCaptureError(err);
        }
      },
    },
  },
};

export default resolvers;
