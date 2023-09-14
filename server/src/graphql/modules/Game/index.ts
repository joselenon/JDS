import validateAndCaptureError from '../../../common/validateAndCaptureError';
import { responseBody } from '../../../helpers/responseHelpers';
import JackpotServiceInstance, {
  JackpotService,
} from '../../../services/GamesServices/JackpotService';
import { PSub, PUBSUB_EVENTS } from '../../pubSubConfig';

const resolvers = {
  Query: {
    getJackpot: async (_: any, __: any, ___: any) => {
      try {
        const jackpot = await JackpotServiceInstance.getJackpotInRedis();
        JackpotService.emitPSub(jackpot);
        return responseBody(true, 'GET_MSG', jackpot);
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
