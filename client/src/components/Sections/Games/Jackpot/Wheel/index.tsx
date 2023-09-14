import React, { useState, useEffect, useRef } from 'react';

import * as styles from './styles';
import AvatarItem from './AvatarItem';
import { v4 } from 'uuid';
import RenderAvatars from './RenderAvatars';
import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';
import Timer from '../Timer/Timer';

interface IWheelProps {
  jackpotInfo: TGetJackpotResponse;
}

export default function Wheel({ jackpotInfo }: IWheelProps) {
  const wheelRef = useRef<any>(undefined);
  const { bets, prizePool, winningBetRef, status } = jackpotInfo;
  const [renderedAvatars, setRenderedAvatars] = useState<JSX.Element[] | undefined>(
    undefined,
  );

  const getJSXAvatars = (avatarsArray: string[]) => {
    return avatarsArray.map((avatarURL) => {
      return <AvatarItem avatarUrl={avatarURL} key={v4()} />;
    });
  };

  const renderAvatars = () => {
    const render = new RenderAvatars(bets, prizePool);
    const avatarOrder = winningBetRef
      ? render.winnerRender(winningBetRef)
      : render.normalRender();
    setRenderedAvatars(getJSXAvatars(avatarOrder));
  };

  useEffect(() => {
    renderAvatars();
    if (status === 'FINISHED') {
      wheelRef.current.classList.add('start');
    } else {
      wheelRef.current.classList.remove('start');
    }
  }, [status, bets]);

  return (
    <styles.WheelContainer>
      {jackpotInfo &&
        (jackpotInfo.status === 'FINISHED' || jackpotInfo.status === 'CLOSED') && (
          <styles.WheelPointer
            $jackpotFinished={jackpotInfo.status === 'FINISHED' ? true : false}
          />
        )}

      <styles.AvatarsContainer ref={wheelRef}>{renderedAvatars}</styles.AvatarsContainer>

      <styles.AbsoluteContainer
        $jackpotStarted={jackpotInfo && jackpotInfo.status === 'FINISHED' ? true : false}
      >
        {jackpotInfo.startedAt && (
          <Timer
            style={{ color: 'white', textShadow: '0 0 10px black', fontSize: '40px' }}
            startedAt={jackpotInfo.startedAt}
            duration={jackpotInfo.jackpotDuration}
          />
        )}

        {jackpotInfo && jackpotInfo.bets.length === 0 && (
          <styles.AguardandoApostasText
            $jackpotStarted={
              jackpotInfo && jackpotInfo.status === 'FINISHED' ? true : false
            }
          >
            Aguardando apostas...
          </styles.AguardandoApostasText>
        )}
      </styles.AbsoluteContainer>
    </styles.WheelContainer>
  );
}
