import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as styles from './styles';

import Logo from '../Logo';
import Balance from './Balance';
import { RootState } from '../../../redux';
import User from './User';
import Auth from './Auth';

export default function Header() {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const balance = authState.userInfo && <Balance />;

  return (
    <styles.HeaderContainer>
      <styles.Header>
        <Logo />
        {windowSize < 1000 && balance}
        <styles.AuthUserContainer>
          {windowSize > 1000 && balance}
          {authState.userInfo ? <User /> : <Auth />}
        </styles.AuthUserContainer>
      </styles.Header>
    </styles.HeaderContainer>
  );
}
