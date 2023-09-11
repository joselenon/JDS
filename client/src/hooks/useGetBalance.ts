import { useEffect, useState, useRef } from 'react';

import { gqlQuery, gqlSubscription } from './useGraphQLService';

import USER_QUERIES from '../graphql/UserInfoGQL';
import { toast } from 'react-toastify';

// Persists balance value after renderization
let balanceRecover = 0;

export default function useGetBalance() {
  const errorMessageAlreadyDisplayed = useRef(false);
  const [balance, setBalance] = useState(balanceRecover);

  // Get balance
  const fetchBalanceData = gqlQuery<{ balance: number }, 'getBalance'>({
    gql: USER_QUERIES.GET_BALANCE,
  });

  // Subscribe to live balance events
  const fetchLiveBalanceData = gqlSubscription<{ balance: number }, 'getLiveBalance'>({
    gql: USER_QUERIES.GET_LIVE_BALANCE,
  });

  useEffect(() => {
    if (fetchBalanceData.error && !errorMessageAlreadyDisplayed.current) {
      errorMessageAlreadyDisplayed.current = true;
    }

    if (fetchBalanceData.data) {
      const { getBalance } = fetchBalanceData.data;
      balanceRecover = getBalance.data.balance;
      setBalance(balanceRecover);
    }

    // Subscribe to live balance events
    if (fetchLiveBalanceData?.data) {
      const { getLiveBalance } = fetchLiveBalanceData.data;

      if (getLiveBalance.success) {
        balanceRecover = getLiveBalance.data.balance;
        setBalance(balanceRecover);
      } else {
        toast.error(fetchLiveBalanceData.data.getLiveBalance.message);
      }
    }
  }, [fetchBalanceData, fetchLiveBalanceData]);

  return balance;
}
