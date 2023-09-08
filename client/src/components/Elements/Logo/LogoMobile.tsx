import React from 'react';
import { Link } from 'react-router-dom';

import * as styles from './styles';

export default function LogoMobile() {
  return (
    <styles.LogoContainer>
      <Link to={'/'}>
        <styles.SaulloContainer>
          <styles.JDContainer>
            <styles.JText style={{ color: 'white' }}>J</styles.JText>
            <styles.DText style={{ color: '#9e9e9e' }}>D</styles.DText>
          </styles.JDContainer>
          <styles.SAULLOText>S</styles.SAULLOText>
        </styles.SaulloContainer>
      </Link>
    </styles.LogoContainer>
  );
}
