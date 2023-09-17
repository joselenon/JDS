import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import * as styles from './styles';

import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';
import OpacitySkeleton from '../../../../Utils/OpacitySkeleton';
import { DEFAULT_JACKPOT_STATE } from '../../../../../config/constants/DEFAULT_JACKPOT_STATE';
import GameInfo from '../GameInfo';
import Modal from '../../../../Elements/Modal';

interface ILastWinnersProps {
  lastJackpotsInfo: TGetJackpotResponse[];
}

export default function LastJackpots({ lastJackpotsInfo }: ILastWinnersProps) {
  const [lastWinners, setLastWinners] = useState<JSX.Element[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGameInfo, setSelectedGameInfo] =
    useState<TGetJackpotResponse>(DEFAULT_JACKPOT_STATE);

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const handleShowGameInfo = (jackpot: TGetJackpotResponse) => {
    setSelectedGameInfo(jackpot);
    toggleModal();
  };

  useEffect(() => {
    console.log(showModal);
  }, [showModal]);

  useEffect(() => {
    const lastWinnersHTML = lastJackpotsInfo.map((jackpot) => (
      <styles.Game key={jackpot.docId} onClick={() => handleShowGameInfo(jackpot)}>
        <img src={jackpot.winningBetRef?.userInfo.avatar} width={'100%'} />
      </styles.Game>
    ));
    setLastWinners(lastWinnersHTML);
  }, [lastJackpotsInfo]);

  const lastWinnerWithSkeletonsHTMl = [...lastWinners];
  const skeletonAmount = lastWinners.length > 0 ? 10 - lastWinners.length : 10;
  for (let i = 0; i < skeletonAmount; i++) {
    lastWinnerWithSkeletonsHTMl.push(
      <div key={v4()} style={{ width: 26, height: 26 }}>
        <OpacitySkeleton />
      </div>,
    );
  }

  return (
    <styles.LastJackpotsContainer>
      <h2>Last Winners</h2>
      <styles.GamesContainer>{lastWinnerWithSkeletonsHTMl}</styles.GamesContainer>
      <Modal showModal={showModal} toggleModal={toggleModal}>
        <GameInfo gameInfo={selectedGameInfo} />
      </Modal>
    </styles.LastJackpotsContainer>
  );
}
