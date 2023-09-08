import React from 'react';

import * as styles from './styles';

import IAuthState from '../../../config/interfaces/IAuthState';
import LevelBar from '../../Elements/LevelBar';
import OpacitySkeleton from '../../Utils/OpacitySkeleton';

interface Props {
  auth: IAuthState;
}

export default function UserAndLevel(props: Props) {
  const { auth } = props;

  return (
    <styles.UserLevelContainer>
      <styles.UsernameContainer>
        {auth.userInfo?.username ? (
          <h2>{auth.userInfo?.username}</h2>
        ) : (
          <OpacitySkeleton />
        )}
      </styles.UsernameContainer>
      <LevelBar />
    </styles.UserLevelContainer>
  );
}
