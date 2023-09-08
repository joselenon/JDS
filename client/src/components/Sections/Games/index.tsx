import React from 'react';
import { Link } from 'react-router-dom';

import * as styles from './styles';

import JackpotItem from './JackpotItem';
import PapumteyItem from './PapumteyItem';

export default function Games() {
  return (
    <styles.GamesItemsContainer>
      <Link to="/jackpot" className="jackpot">
        <JackpotItem />
      </Link>
      <Link to={'/'} className="papumtey">
        <PapumteyItem />
      </Link>
    </styles.GamesItemsContainer>
  );
}
