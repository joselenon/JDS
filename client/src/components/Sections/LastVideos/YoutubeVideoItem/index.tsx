import React from 'react';

import * as styles from './styles';

import replaceHTMLEntities from '../../../../common/replaceHTMLEntities';
import { IYoutubeVideo } from '../../../../config/interfaces/IYoutube';
import HoverAnimatedElement from '../../../Utils/HoverAnimatedElement';

const avatar = require('../../../../assets/images/avatar.png');
const urlvideo = 'https://www.youtube.com/watch?v=';

interface Props {
  item: IYoutubeVideo;
}

export default function YoutubeVideoItem(props: Props) {
  const { item } = props;

  return (
    <a
      key={item.id.videoId}
      href={`${urlvideo}${item.id.videoId}`}
      target="_blank"
      rel="noreferrer"
    >
      <HoverAnimatedElement>
        <styles.CarouselItem>
          <styles.Picture>
            <img src={item.snippet.thumbnails.medium.url} alt="" />
          </styles.Picture>
          <styles.ItemDescription>
            <styles.Channel>
              <img src={avatar} alt="canal do saullo avatar" width={20} />
              <h3>Canal do Saullo</h3>
            </styles.Channel>
            <styles.VideoDescription>
              {replaceHTMLEntities(item.snippet.title)}
            </styles.VideoDescription>
          </styles.ItemDescription>
        </styles.CarouselItem>
      </HoverAnimatedElement>
    </a>
  );
}
