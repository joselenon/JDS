import React from 'react';
import { Link } from 'react-router-dom';

import * as styles from './styles';

export default function LogoDefault() {
  return (
    <styles.LogoContainer>
      <Link to={'/'}>
        <styles.SaulloContainer>
          <styles.JogosDoContainer>
            <span style={{ color: 'white' }}>JOGOS</span>
            <span style={{ color: '#9e9e9e' }}>DO</span>
          </styles.JogosDoContainer>
          <styles.SAULLOText>SAULLO</styles.SAULLOText>
        </styles.SaulloContainer>
      </Link>
    </styles.LogoContainer>
  );
}
