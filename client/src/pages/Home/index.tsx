import React from 'react';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import LastVideos from '../../components/Sections/LastVideos';
import HomeBanner from '../../components/Sections/HomeBanner';
import IconedSection from '../../components/Utils/IconedSection';
import GamesHub from '../../components/Sections/GamesHub';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HomeWelcome from '../../components/Sections/HomeWelcome';

export default function Home() {
  return (
    <div className="main-wrapper">
      {/* <HomeWelcome /> */}
      <IconedSection icon={faDice} title="Jogos" Content={<GamesHub />} />
      <div />
      <div />
      <HomeBanner />
      <div />
      <div />
      <IconedSection icon={faYoutube} title="Últimos Vídeos" Content={<LastVideos />} />
      <div />
    </div>
  );
}
