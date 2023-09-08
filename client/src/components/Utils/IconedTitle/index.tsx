import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import * as styles from './styles';

export interface IIconedTitleProps {
  icon: IconDefinition;
  title: string;
}

export default function IconedTitle(props: IIconedTitleProps) {
  const { icon, title } = props;

  const iconElement = <FontAwesomeIcon icon={icon} />;

  return (
    <styles.TitleContainer>
      {iconElement} <h2>{title}</h2>
    </styles.TitleContainer>
  );
}
