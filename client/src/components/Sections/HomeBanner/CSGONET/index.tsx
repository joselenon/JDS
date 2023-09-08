import React from 'react';

import * as styles from './styles';

const csgonetLogo = require('../../../../assets/images/csgonet-logo.png');

export default function CSGONET() {
  return (
    <a href="https://csgo.net/" target="_blank" rel="noreferrer">
      <styles.CSGONETContainer>
        <styles.Logo>
          <img src={csgonetLogo} alt="" width={14} />{' '}
          <styles.CSGONET>CSGONET</styles.CSGONET>
        </styles.Logo>
        <styles.UseOCupom>USE O CUPOM</styles.UseOCupom>
        <styles.Sonho>SONHO</styles.Sonho>
        <styles.ParaBonus>
          <span style={{ color: 'white' }}>PARA</span>
          <span style={{ color: 'green' }}> 40%</span>{' '}
          <span style={{ color: 'white' }}>DE</span>{' '}
          <span style={{ color: '#3a7ada' }}>BÔNUS</span>
        </styles.ParaBonus>
      </styles.CSGONETContainer>
    </a>
  );
}
