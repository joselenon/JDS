import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import * as styles from './styles';
import IReduxStore from '../../../config/interfaces/IReduxStore';
import RedSkeleton from '../../Utils/RedSkeleton';

function Avatar() {
  const userInfo = useSelector((state: IReduxStore) => state.auth.userInfo);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleOnLoad = () => {
    setImageLoaded(true);
  };

  return (
    <styles.AvatarContainer $imageLoaded={imageLoaded}>
      <img
        src={userInfo?.avatar}
        alt={`user-avatar: ${userInfo?.username}`}
        onLoad={handleOnLoad}
      />
      {!userInfo?.avatar || !imageLoaded ? <RedSkeleton /> : null}
    </styles.AvatarContainer>
  );
}

export default React.memo(Avatar);
