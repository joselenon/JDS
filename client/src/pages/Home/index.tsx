import React from 'react';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import LastVideos from '../../components/Sections/LastVideos';
import HomeBanner from '../../components/Sections/HomeBanner';
import HomeWelcome from '../../components/Sections/HomeWelcome';
import IconedSection from '../../components/Utils/IconedSection';
import GamesHub from '../../components/Sections/GamesHub';

export default function Home() {
  return (
    <div className="main-wrapper">
      <HomeWelcome />
      <IconedSection icon={faDice} title="Jogos" Body={GamesHub} />
      <div />
      <div />
      <HomeBanner />
      <div />
      <div />
      <IconedSection icon={faYoutube} title="Últimos Vídeos" Body={LastVideos} />
      <div />
    </div>
  );
}
