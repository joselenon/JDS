import React from 'react';

import * as styles from './styles';

import { BTN_TYPES, IButton } from '../../../styles/BUTTONS_STYLES';
import Avatar from '../Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { IconType } from 'react-icons/lib';

export default function Button(props: IButton): JSX.Element {
  const { btnType, icon, label, img, onClickFn, type, id } = props;

  const btnStyles: React.CSSProperties = BTN_TYPES[btnType];

  const iconElement = () => {
    if (icon) {
      if (icon.provider === 'fontAwesome') {
        return <FontAwesomeIcon icon={icon.element as IconDefinition} />;
      }
      if (icon.provider === 'reactIcons') {
        const Element = icon.element as IconType;
        return <Element />;
      }
    } else {
      null;
    }
  };

  return (
    <styles.Button
      id={id ? id : ''}
      type={type ? type : 'button'}
      style={btnStyles}
      onClick={onClickFn}
    >
      {iconElement() || null}
      {label ? (typeof label === 'string' ? label.toUpperCase() : label) : ''}
      {img && <Avatar />}
    </styles.Button>
  );
}
