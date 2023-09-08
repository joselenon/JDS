import validateAndCaptureError from '../../../common/validateAndCaptureError';
import IGQLContext from '../../../config/interfaces/IGQLContext';
import { IJackpotBetPayload } from '../../../config/interfaces/IPayloads';

const resolvers = {
  Mutation: {
    betOnJackpot: async (
      _: any,
      { payload }: { payload: IJackpotBetPayload },
      context: IGQLContext,
    ) => {
      try {
        const { validateAuth, jwtToken, BetControllerGQL } = context;
        const userInfo = await validateAuth(jwtToken);
        await BetControllerGQL.makeBetOnJackpot(userInfo, payload);
        return true;
      } catch (err) {
        validateAndCaptureError(err);
      }
    },
  },
};

export default resolvers;
