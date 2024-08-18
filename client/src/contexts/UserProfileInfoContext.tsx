import React, { ReactNode, useContext, useState, useEffect } from 'react';
import IUser from '../config/interfaces/IUser';
import USER_QUERIES from '../graphql/UserInfoGQL';
import { gqlQuery } from '../hooks/useGraphQLService';

const UserInfoContext = React.createContext<IUser | undefined>(undefined);

export default function UserInfoContextProvider({ children }: { children: ReactNode }) {
  const [userInfoData, setUserInfoData] = useState<IUser | undefined>(undefined);

  const { data, refetch } = gqlQuery<IUser, 'getUser'>({
    gql: USER_QUERIES.GET_USER_INFO,
  });

  useEffect(() => {
    refetch && refetch();
    if (data) {
      setUserInfoData(data.getUser.data);
    }
  }, [data, userInfoData]);

  return (
    <UserInfoContext.Provider value={userInfoData}>{children}</UserInfoContext.Provider>
  );
}

export function useUserInfoContext() {
  return useContext(UserInfoContext);
}
