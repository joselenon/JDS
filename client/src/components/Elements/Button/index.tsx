import React from 'react';

import * as styles from './styles';

import IButton from '../../../config/interfaces/IButton';
import BTN_TYPES from '../../../styles/BUTTONS_STYLES';
import Avatar from '../Avatar';

export default function Button(props: IButton): JSX.Element {
  const { btnType, icon, label, img, onClickFn, type, id } = props;

  const styleConfig = BTN_TYPES[btnType];

  return (
    <styles.Button
      id={id ? id : ''}
      type={type ? type : 'button'}
      $styleConfig={styleConfig}
      onClick={onClickFn}
    >
      {icon}
      {label ? (typeof label === 'string' ? label.toUpperCase() : label) : ''}
      {img && <Avatar />}
    </styles.Button>
  );
}
