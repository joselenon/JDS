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
    <styles.SectionContainer>
      <IconedTitle icon={icon} title={title} />
      <Body />
    </styles.SectionContainer>
  );
}
