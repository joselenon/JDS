import { useState, useEffect } from 'react';

import { TGetJackpotResponse } from '../config/interfaces/IGQLResponses';
import { gqlQuery, gqlSubscription } from './useGraphQLService';
import { GET_LAST_JACKPOTS, GET_LIVE_LAST_JACKPOTS } from '../graphql/JackpotGQL';

export default function useGetLastJackpots() {
  const [lastJackpots, setLastJackpots] = useState<TGetJackpotResponse[] | undefined>(
    undefined,
  );

  const lastJackpotsFetch = gqlQuery<TGetJackpotResponse[], 'getLastJackpots'>({
    gql: GET_LAST_JACKPOTS,
  });

  const liveLastJackpotsFetch = gqlSubscription<
    TGetJackpotResponse[],
    'getLiveLastJackpots'
  >({
    gql: GET_LIVE_LAST_JACKPOTS,
  });

  useEffect(() => {
    if (lastJackpotsFetch.data) {
      setLastJackpots(lastJackpotsFetch.data.getLastJackpots.data);
    }

    if (liveLastJackpotsFetch?.data) {
      setLastJackpots(liveLastJackpotsFetch.data.getLiveLastJackpots.data);
    }
  }, [lastJackpotsFetch, liveLastJackpotsFetch]);

  return { lastJackpotsInfo: lastJackpots };
}
