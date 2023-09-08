import React from 'react';

import * as styles from './styles';

import Logo from './Logo';
import CSGONET from './CSGONET';

export default function HomeBanner() {
  return (
    <styles.BannerContainer>
      <styles.Catchphrase>
        <styles.Catch1>
          <span>Jogue de mentira</span>
        </styles.Catch1>
        <styles.Catch2>
          <span>Ganhe de verdade</span>
        </styles.Catch2>
      </styles.Catchphrase>

      <styles.BannerAds>
        <Logo />
        <styles.Versus>X</styles.Versus>
        <CSGONET />
      </styles.BannerAds>
    </styles.BannerContainer>
  );
}
