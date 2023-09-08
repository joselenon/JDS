import React from 'react';

import * as styles from './styles';

interface Props {
  avatarUrl: string;
}

export default function AvatarItem(props: Props) {
  const { avatarUrl } = props;
  return (
    <styles.AvatarItemContainer>
      <img src={avatarUrl} />
    </styles.AvatarItemContainer>
  );
}
