import { useEffect, useState, useRef } from 'react';

import { gqlQuery, gqlSubscription } from './useGraphQLService';
import { TGetJackpotResponse } from '../config/interfaces/IGQLResponses';
import { GET_JACKPOT, GET_LIVE_JACKPOT } from '../graphql/JackpotGQL';

export default function useGetJackpot() {
  const alreadyFetchedOnce = useRef(false);
  const [jackpot, setJackpot] = useState<TGetJackpotResponse | undefined>(undefined);

  const jackpotFetch = gqlQuery<TGetJackpotResponse, 'getJackpot'>({
    gql: GET_JACKPOT,
  });

  const liveJackpotFetch: any = gqlSubscription<TGetJackpotResponse, 'getLiveJackpot'>({
    gql: GET_LIVE_JACKPOT,
  });

  useEffect(() => {
    if (jackpotFetch?.data && !alreadyFetchedOnce.current) {
      setJackpot(jackpotFetch.data.getJackpot.data);
      alreadyFetchedOnce.current = true;
    }

    if (liveJackpotFetch?.data) {
      const jackpotData = liveJackpotFetch.data.getLiveJackpot.data;
      console.log(jackpotData);
      setJackpot(jackpotData);
    }
  }, [jackpotFetch, liveJackpotFetch]);

  useEffect(() => {
    console.log('agora asis', jackpot);
  }, [jackpot]);

  return { jackpotInfo: jackpot, refetch: jackpotFetch.refetch };
}
