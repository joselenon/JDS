import React, { useEffect, useState, memo } from 'react';
import { v4 } from 'uuid';

import * as styles from './styles';

import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';
import OpacitySkeleton from '../../../../Utils/OpacitySkeleton';
import { DEFAULT_JACKPOT_STATE } from '../../../../../config/constants/DEFAULT_JACKPOT_STATE';
import GameInfo from '../GameInfo';
import Modal from '../../../../Elements/Modal';
import RedSkeleton from '../../../../Utils/RedSkeleton';

interface ILastWinnersProps {
  lastJackpotsInfo: TGetJackpotResponse[];
}

function LastJackpots({ lastJackpotsInfo }: ILastWinnersProps) {
  const [widthSize, setWidthSize] = useState<number | undefined>(undefined);
  const [historyAmount, setHistoryAmount] = useState(10);

  const mobileMode = { width: 600, historyAmount: 6 };
  const toggleMode = () => {
    if (widthSize && widthSize < mobileMode.width) {
      return setHistoryAmount(mobileMode.historyAmount);
    } else {
      return setHistoryAmount(10);
    }
  };

  useEffect(() => {
    const getWidth = () => {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      setWidthSize(width);
    };
    getWidth();

    window.addEventListener('resize', getWidth);
    return () => {
      window.removeEventListener('resize', getWidth);
    };
  }, []);

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
    toggleMode();
    const lastJackpotsInfoCopy = [...lastJackpotsInfo];
    if (widthSize && widthSize < mobileMode.width) {
      lastJackpotsInfoCopy.splice(historyAmount);
    }
    const lastWinnersHTML = lastJackpotsInfoCopy.map((jackpot) => (
      <styles.Game key={v4()} onClick={() => handleShowGameInfo(jackpot)}>
        {jackpot.winningBetRef?.userInfo.avatar ? (
          <img src={jackpot.winningBetRef?.userInfo.avatar} width={'100%'} />
        ) : (
          <div style={{ width: '20px', height: 20 }}>
            <RedSkeleton />
          </div>
        )}
      </styles.Game>
    ));
    setLastWinners(lastWinnersHTML);
  }, [lastJackpotsInfo, widthSize]);

  const lastWinnerWithSkeletonsHTMl = [...lastWinners];
  const skeletonAmount =
    lastWinners.length > 0 ? historyAmount - lastWinners.length : historyAmount;
  for (let i = 0; i < skeletonAmount; i++) {
    lastWinnerWithSkeletonsHTMl.push(
      <div key={v4()} style={{ width: 26, height: 26 }}>
        <OpacitySkeleton />
      </div>,
    );
  }

  return (
    <styles.LastJackpotsContainer>
      <h2>Últimos Vencedores</h2>
      <styles.GamesContainer>{lastWinnerWithSkeletonsHTMl}</styles.GamesContainer>
      <Modal showModal={showModal} toggleModal={toggleModal}>
        <GameInfo gameInfo={selectedGameInfo} reset={showModal} />
      </Modal>
    </styles.LastJackpotsContainer>
  );
}

export default memo(LastJackpots);
