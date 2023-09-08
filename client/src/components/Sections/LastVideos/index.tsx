import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Carousel from '../../Elements/Carousel';
import YoutubeVideoItem from './YoutubeVideoItem';
import useGetYTBVideos from '../../../hooks/useGetYTBVideos';
import YoutubeVideoSkeleton from './YoutubeVideoItem/skeleton';

export default function LastVideos() {
  const data = useGetYTBVideos();

  let items = [];
  if (data) {
    items = data.items.map((item) => (
      <YoutubeVideoItem key={item.id.videoId} item={item} />
    ));
  } else {
    for (let i = 0; i < 6; i++) {
      items.push(<YoutubeVideoSkeleton key={uuidv4()} />);
    }
  }

  return <Carousel items={items} />;
}
