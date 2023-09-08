import React from 'react';

import * as styles from './styles';
import CustomHR from '../../Utils/CustomHR';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';

export default function Footer() {
  return (
    <styles.FooterContainer>
      <styles.FooterWrapper>
        <FirstSection />
        <CustomHR
          direction="HORIZONTAL"
          width={undefined}
          height={undefined}
          color="#c73434"
        />
        <SecondSection />
      </styles.FooterWrapper>
    </styles.FooterContainer>
  );
}
