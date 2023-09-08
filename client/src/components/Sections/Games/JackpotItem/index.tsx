import React from 'react';

import * as gamesStyles from '../styles';
import * as styles from './styles';
import HoverAnimatedElement from '../../../Utils/HoverAnimatedElement';

const jackpotWheel = require('../../../../assets/images/jackpotwheel.png');

export default function JackpotItem() {
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
        <gamesStyles.Vignette />
        <styles.Elements>
          <gamesStyles.GameText>JACKPOT</gamesStyles.GameText>
          <div>
            <gamesStyles.JackpotWheelImg src={jackpotWheel} />
          </div>
        </styles.Elements>
      </gamesStyles.GameItemContainer>
    </HoverAnimatedElement>
  );
}
