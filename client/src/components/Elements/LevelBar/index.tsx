import React from 'react';
import { useSelector } from 'react-redux';

import * as styles from './styles';

import IReduxStore from '../../../config/interfaces/IReduxStore';
import OpacitySkeleton from '../../Utils/OpacitySkeleton';

export default function LevelBar() {
  const userInfo = useSelector((state: IReduxStore) => state.auth.userInfo);

  return (
    <styles.LevelBarContainer>
      {userInfo ? <styles.LevelBar /> : <OpacitySkeleton />}
    </styles.LevelBarContainer>
  );
}
