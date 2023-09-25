// Att make state update realtime when new info is inserted

import { useState, useEffect } from 'react';
import { IUserInfo } from '../config/interfaces/IUser';
import { gqlQuery } from './useGraphQLService';

import USER_QUERIES from '../graphql/UserInfoGQL';

export default function useGetUserInfo() {
  const [userInfoData, setUserInfoData] = useState<IUserInfo | undefined>(undefined);

  const { data, refetch } = gqlQuery<IUserInfo, 'getUser'>({
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
