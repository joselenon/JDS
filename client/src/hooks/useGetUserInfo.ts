// Att make state update realtime when new info is inserted

import { useState, useEffect } from 'react';
import { gqlQuery } from './useGraphQLService';

import USER_QUERIES from '../graphql/UserInfoGQL';
import IUser from '../config/interfaces/IUser';

export default function useGetUserInfo() {
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

  return userInfoData;
}
