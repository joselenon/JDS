import React from 'react';

import * as styles from './styles';
import { Link } from 'react-router-dom';
import GiveawayContainer from './Giveaways/GiveawayContainer';
import Socials from './Socials';

export default function FirstSection() {
  return (
    <styles.FirstSectionContainer>
      <styles.FooterTab className="termosESuporte">
        <h3>Termos e Suporte</h3>
        <Link to={'/termos'}>
          <p>Termos</p>
        </Link>
        <Link to={'/politicas'}>
          <p>Políticas</p>
        </Link>
        <Link to={'/suporte'}>
          <p>Suporte</p>
        </Link>
      </styles.FooterTab>
      <styles.FooterTab className="ultimosSorteios">
        <h3>Últimos Sorteios</h3>
        <GiveawayContainer />
      </styles.FooterTab>
      <styles.FooterTab className="redesSociais">
        <h3>Redes Sociais</h3>
        <Socials />
      </styles.FooterTab>
    </styles.FirstSectionContainer>
  );
}
