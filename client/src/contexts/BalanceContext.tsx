// Uncontinued (Built in 'useGetBalance')

import React, { useContext } from 'react';
import { useQuery, useSubscription } from '@apollo/client';

import { GET_BALANCE, GET_LIVE_BALANCE } from '../graphql/UserInfoGQL';

const BalanceContext = React.createContext({});

export default function BalanceContextProvider({ children }: any) {
  const { data, refetch } = useQuery(GET_BALANCE);
  const { data: liveData } = useSubscription(GET_LIVE_BALANCE);

  return (
    <BalanceContext.Provider value={{ balance: { data, refetch, liveData } }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalanceContext() {
  return useContext(BalanceContext);
}
