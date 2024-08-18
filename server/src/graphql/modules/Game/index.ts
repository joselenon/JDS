import { responseBody } from '../../../helpers/responseHelpers';
import { PSub, PUBSUB_EVENTS } from '../../pubSubConfig';
import validateAndCaptureError from '../../../common/validateAndCaptureError';
import JackpotService, {
  JackpotServiceClass,
} from '../../../services/GamesServices/JackpotService';

const resolvers = {
  Query: {
    getJackpot: async (/* _: any, __: any, ___: any */) => {
      try {
        const jackpot = await JackpotServiceClass.getJackpotInRedis();
        return responseBody(true, 'GET_MSG', jackpot);
      } catch (err) {
        validateAndCaptureError(err);
      }
    },

    getLastJackpots: async () => {
      try {
        const lastJackpots = await JackpotService.getLastJackpotsInRedis();
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
