import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import * as styles from './styles';

import IconedTitle from '../IconedTitle';

interface Props {
  icon: IconDefinition;
  title: string;
  Content: JSX.Element;
}

export default function IconedSection(props: Props) {
  const { icon, title, Content } = props;

  return (
    /* Verifies if the body of the section is a Carousel, since it has padding and the spacing is different */
    <styles.SectionContainer $isCarousel={Content.type.name === 'Carousel'}>
      <IconedTitle icon={icon} title={title} />
      {Content}
    </styles.SectionContainer>
  );
}

/*
Usage example:
  import { faDice } from '@fortawesome/free-solid-svg-icons';
  import GamesHub from '../../components/Sections/GamesHub';

  <IconedSection icon={faDice} title="Jogos" Body={GamesHub} />
*/
