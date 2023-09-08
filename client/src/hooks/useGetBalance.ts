import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

import { gqlQuery, gqlSubscription } from './useGraphQLService';
import { TGetBalanceResponse } from '../config/interfaces/IGQLResponses';

import USER_QUERIES from '../graphql/UserInfoGQL';

// Persists balance value after renderization
let balanceRecover = 0;

export default function useGetBalance() {
  const errorMessageAlreadyDisplayed = useRef(false);
  const [balance, setBalance] = useState(balanceRecover);

  // Get balance
  const fetchBalanceData = gqlQuery<TGetBalanceResponse, 'getBalance'>({
    gql: USER_QUERIES.GET_BALANCE,
  });

  // Subscribe to live balance events
  const fetchLiveBalanceData: any = gqlSubscription<
    TGetBalanceResponse,
    'getLiveBalance'
  >({
    gql: USER_QUERIES.GET_LIVE_BALANCE,
  });

  useEffect(() => {
    try {
      console.log(fetchLiveBalanceData);
      // Get balance
      if (fetchBalanceData.error && !errorMessageAlreadyDisplayed.current) {
        toast.error(fetchBalanceData.error.message);
        errorMessageAlreadyDisplayed.current = true;
      }
      if (fetchBalanceData.data) {
        const { balance } = fetchBalanceData.data.getBalance.data;
        balanceRecover = balance;
        setBalance(balanceRecover);
      }

      // Subscribe to live balance events
      if (fetchLiveBalanceData.error && !errorMessageAlreadyDisplayed.current) {
        toast.error(fetchLiveBalanceData.error.message);
        errorMessageAlreadyDisplayed.current = true;
      }
      if (fetchLiveBalanceData.data) {
        const { getLiveBalance } = fetchLiveBalanceData.data;
        balanceRecover = getLiveBalance.data;
        setBalance(balanceRecover);
      }
    } catch (err) {
      console.log(err);
    }
  }, [fetchBalanceData, fetchLiveBalanceData]);

  return balance;
}
