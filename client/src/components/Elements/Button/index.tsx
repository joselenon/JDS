import React from 'react';

import * as styles from './styles';

import { BTN_TYPES, IButton } from '../../../styles/BUTTONS_STYLES';
import Avatar from '../Avatar';

export default function Button(props: IButton): JSX.Element {
  const { btnType, icon, label, img, onClickFn, type, id } = props;

  const btnStyles: React.CSSProperties = BTN_TYPES[btnType];

  return (
    <styles.Button
      id={id ? id : ''}
      type={type ? type : 'button'}
      style={btnStyles}
      onClick={onClickFn}
    >
      {icon}
      {label ? (typeof label === 'string' ? label.toUpperCase() : label) : ''}
      {img && <Avatar />}
    </styles.Button>
  );
}
