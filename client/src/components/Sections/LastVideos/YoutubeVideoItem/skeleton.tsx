import React from 'react';

import * as styles from './styles';
import RedSkeleton from '../../../Utils/RedSkeleton';

export default function YoutubeVideoSkeleton() {
  return (
    <styles.CarouselItem className="shadow-of-animation">
      <styles.Picture>
        <RedSkeleton />
      </styles.Picture>
      <styles.ItemDescription />
    </styles.CarouselItem>
  );
}
