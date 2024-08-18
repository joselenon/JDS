import React from 'react';

import * as styles from './styles';
import Button from '../Button';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';

export default function User() {
  return (
    <styles.UserContainer>
      <Link to={'/perfil'}>
        <Button btnType="ELEMENT" element={<Avatar />} />
      </Link>
    </styles.UserContainer>
  );
}
