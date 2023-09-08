import React from 'react';

import * as styles from './styles';

interface Props {
  img: string;
  description: string;
}

export default function GiveawayItem(props: Props) {
  const { img, description } = props;

  return (
    <a href="/" target="_blank">
      <styles.GiveawayItem>
        <img src={img} alt="" />
        <p>{description}</p>
      </styles.GiveawayItem>
    </a>
  );
}
