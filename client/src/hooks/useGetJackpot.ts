import { useEffect, useState } from 'react';

import { gqlQuery, gqlSubscription } from './useGraphQLService';
import { TGetJackpotResponse } from '../config/interfaces/IGQLResponses';
import JACKPOT_QUERIES from '../graphql/JackpotGQL';

export default function useGetJackpot() {
  const [jackpot, setJackpot] = useState<TGetJackpotResponse | undefined>(undefined);

  const jackpotFetch = gqlQuery<TGetJackpotResponse, 'getJackpot'>({
    gql: JACKPOT_QUERIES.GET_JACKPOT,
  });

  const liveJackpotFetch: any = gqlSubscription<TGetJackpotResponse, 'getLiveJackpot'>({
    gql: JACKPOT_QUERIES.GET_LIVE_JACKPOT,
  });

  useEffect(() => {
    if (jackpotFetch?.data) {
      setJackpot(jackpotFetch.data.getJackpot.data);
    }

    if (liveJackpotFetch?.data) {
      const jackpotData = liveJackpotFetch.data.getLiveJackpot.data;
      setJackpot(jackpotData);
    }
  }, [jackpotFetch, liveJackpotFetch]);

  return { jackpotInfo: jackpot, refetch: jackpotFetch.refetch };
}
