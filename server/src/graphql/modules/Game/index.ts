import { responseBody } from '../../../helpers/responseHelpers';
import JackpotServiceInstance from '../../../services/GamesServices/JackpotService';
import { PSub, PUBSUB_EVENTS } from '../../pubSubConfig';
import validateAndCaptureError from '../../../common/validateAndCaptureError';

const resolvers = {
  Query: {
    getJackpot: async (/* _: any, __: any, ___: any */) => {
      try {
        const jackpot = await JackpotServiceInstance.getJackpotInRedis();
        return responseBody(true, 'GET_MSG', jackpot);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },
    getLastJackpots: async () => {
      try {
        const lastJackpots =
          await JackpotServiceInstance.getLastJackpotsInRedis();
        // JackpotService.emitPSub(jackpot);
        return responseBody(true, 'GET_MSG', lastJackpots);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },
  },

  Subscription: {
    getLiveLastJackpots: {
      subscribe: async (/* _: any, __: any */) => {
        try {
          return PSub.asyncIterator([
            PUBSUB_EVENTS.GET_LIVE_LAST_JACKPOTS.triggerName,
          ]);
        } catch (err) {
          validateAndCaptureError(err);
        }
      },
    },
    getLiveJackpot: {
      subscribe: async () => {
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
