import React from 'react';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import LastVideos from '../../components/Sections/LastVideos';
import Games from '../../components/Sections/Games';
import HomeBanner from '../../components/Sections/HomeBanner';
import HomeWelcome from '../../components/Sections/HomeWelcome';
import IconedSection from '../../components/Utils/IconedSection';

export default function Home() {
  return (
    <div className="main-wrapper">
      <HomeWelcome />
      <IconedSection icon={faDice} title="Jogos" Body={Games} />
      <HomeBanner />
      <IconedSection icon={faYoutube} title="Últimos Vídeos" Body={LastVideos} />
    </div>
  );
}
