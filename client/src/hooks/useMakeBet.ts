import { IMakeBetPayload } from '../config/interfaces/IPayloads';
import { gqlMutation } from './useGraphQLService';
import BET_QUERIES from '../graphql/BetGQL';

export default function useMakeBet() {
  const mutationFn = gqlMutation({ gql: BET_QUERIES.BET_ON_JACKPOT });

  const makeBet = async (payload: IMakeBetPayload) => {
    if (mutationFn) {
      await mutationFn(payload);
    }
  };

  return makeBet;
}
