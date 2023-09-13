import { IMakeBetPayload } from '../config/interfaces/IPayloads';
import { gqlMutation } from './useGraphQLService';
import BET_QUERIES from '../graphql/BetGQL';
import { toast } from 'react-toastify';
import ERROR_MSGS from '../config/constants/ERROR_MSGS';

export default function useMakeBet() {
  const mutationFn = gqlMutation({ gql: BET_QUERIES.BET_ON_JACKPOT });

  const makeBetFn = async (payload: IMakeBetPayload) => {
    if (mutationFn) {
      try {
        await mutationFn(payload);
      } catch (err: any) {
        if (err.message === 'Failed to fetch') {
          return toast.error(ERROR_MSGS.SERVER_OFFLINE_MSG);
        }
        return toast.error(err.message);
      }
    } else {
      return null;
    }
  };

  return makeBetFn;
}
