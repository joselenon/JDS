import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

import { gqlQuery, gqlSubscription } from './useGraphQLService';
import { TGetJackpotResponse } from '../config/interfaces/IGQLResponses';
import JACKPOT_QUERIES from '../graphql/JackpotGQL';

export default function useGetJackpot() {
  const errorMessageAlreadyDisplayed = useRef(false);
  const [jackpot, setJackpot] = useState<TGetJackpotResponse | undefined>(undefined);

  const {
    data: jackpotData,
    error: jackpotDataErrors,
    refetch: jackpotDataRefetch,
  } = gqlQuery<TGetJackpotResponse, 'getJackpot'>({
    gql: JACKPOT_QUERIES.GET_JACKPOT,
  });

  const { data: liveJackpotData, error: liveJackpotDataErrors }: any = gqlSubscription<
    TGetJackpotResponse,
    'getLiveJackpot'
  >({
    gql: JACKPOT_QUERIES.GET_LIVE_JACKPOT,
  });

  useEffect(() => {
    if (jackpotDataErrors && !errorMessageAlreadyDisplayed.current) {
      toast.error(jackpotDataErrors.message);
      errorMessageAlreadyDisplayed.current = true;
    }
    if (jackpotData) {
      console.log('entrou aquiaawdad');
      setJackpot(jackpotData.getJackpot.data);
    }

    if (liveJackpotDataErrors && !errorMessageAlreadyDisplayed.current) {
      toast.error(liveJackpotDataErrors.message);
      errorMessageAlreadyDisplayed.current = true;
    }
    if (liveJackpotData) {
      const jackpotData = liveJackpotData.getLiveJackpot.data;
      setJackpot(jackpotData);
    }
  }, [jackpotData, liveJackpotData]);

  return { jackpotInfo: jackpot, refetch: jackpotDataRefetch };
}
