import React from 'react';

import * as styles from './styles';
import { useSelector } from 'react-redux';
import IReduxStore from '../../../config/interfaces/IReduxStore';
import Button from '../Button';
import { Link } from 'react-router-dom';

export default function User() {
  const avatar = useSelector((state: IReduxStore) => state.auth.userInfo?.avatar);

  return (
    <styles.UserContainer>
      <Link to={'/perfil'}>
        <Button btnType="IMG" img={avatar ? avatar : ''}></Button>
      </Link>
    </styles.UserContainer>
  );
}
