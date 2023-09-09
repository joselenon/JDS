import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import * as styles from './styles';

import IconedTitle from '../IconedTitle';

interface Props {
  icon: IconDefinition;
  title: string;
  Body: () => JSX.Element;
}

export default function IconedSection(props: Props) {
  const { icon, title, Body } = props;

  return (
    /* Verifies if the body of the section is a Carousel, since it has padding and the spacing is different */
    <styles.SectionContainer $isCarousel={Body().type.name === 'Carousel'}>
      <IconedTitle icon={icon} title={title} />
      <Body />
    </styles.SectionContainer>
  );
}
