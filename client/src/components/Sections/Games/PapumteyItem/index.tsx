import React from 'react';

import * as gamesStyles from '../styles';
import * as styles from './styles';
import HoverAnimatedElement from '../../../Utils/HoverAnimatedElement';

export default function PapumteyItem() {
  function handleHover(e: any) {
    if (e.type === 'mouseenter') e.currentTarget.lastChild.classList.add('hover');
    if (e.type === 'mouseleave') e.currentTarget.lastChild.classList.remove('hover');
  }

  return (
    <HoverAnimatedElement>
      <gamesStyles.GameItemContainer
        onMouseEnter={(e) => handleHover(e)}
        onMouseLeave={(e) => handleHover(e)}
      >
        <gamesStyles.ComingSoon>
          <h2>EM BREVE</h2>
        </gamesStyles.ComingSoon>
        <gamesStyles.Vignette />
        <styles.Elements>
          {/* Cores diferenciadas (animação) */}
          <styles.GameText>papumTEY</styles.GameText>
          {/* gif */}
        </styles.Elements>
      </gamesStyles.GameItemContainer>
    </HoverAnimatedElement>
  );
}
