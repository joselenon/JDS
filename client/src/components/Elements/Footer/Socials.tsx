import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitch,
  faXTwitter,
  faYoutube,
  faInstagram,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';

import * as styles from './styles';

export default function Socials() {
  return (
    <styles.SocialsContainer>
      <a href="https://twitter.com/CanalDoSaullo" target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faXTwitter} className="twitter" />
      </a>
      <a href="https://www.twitch.tv/saullo" target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faTwitch} className="twitch" />
      </a>
      <a
        href="https://www.youtube.com/channel/UCiz-NHCExb8Q1zmvy0An4ug"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faYoutube} className="youtube" />
      </a>
      <a href="https://www.twitch.tv/saullo" target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faInstagram} className="instagram" />
      </a>
      <a href="https://web.telegram.org/k/#@SaulloCS" target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faTelegram} className="telegram" />
      </a>
    </styles.SocialsContainer>
  );
}
