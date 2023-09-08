import React from 'react';

import * as styles from './styles';

import Brand from './Brand';

export default function SecondSection() {
  return (
    <styles.SecondSectionContainer>
      <Brand />
      <p>© 2023 Jogos do Saullo | Todos direitos reservados.</p>
    </styles.SecondSectionContainer>
  );
}
