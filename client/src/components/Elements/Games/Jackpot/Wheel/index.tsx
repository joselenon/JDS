import React, { useState, useEffect, useRef } from 'react';

import * as styles from './styles';
import AvatarItem from './AvatarItem';
import { v4 } from 'uuid';
import RenderAvatars from './RenderAvatars';
import { IBet } from '../../../../../config/interfaces/IBet';
import { TGetJackpotResponse } from '../../../../../config/interfaces/IGQLResponses';
import Timer from '../Timer/Timer';

interface IWheelProps {
  props: {
    jackpotInfo: TGetJackpotResponse | undefined;
    status: TGetJackpotResponse['status'];
    bets: IBet[];
    prizePool: number;
    winningBetRef: IBet | undefined;
  };
}

export default function Wheel(props: IWheelProps) {
  const wheelRef = useRef<any>(undefined);
  const { bets, prizePool, winningBetRef, status, jackpotInfo } = props.props;
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
    if (status === 'FINISHED') {
      wheelRef.current.classList.add('start');
    } else {
      wheelRef.current.classList.remove('start');
      if (bets) renderAvatars();
    }
  }, [status, bets]);

  return (
    <styles.WheelContainer>
      {jackpotInfo &&
      (jackpotInfo.status === 'FINISHED' || jackpotInfo.status === 'CLOSED') ? (
        <styles.WheelPointer
          jackpotFinished={jackpotInfo.status === 'FINISHED' ? true : false}
        />
      ) : (
        <></>
      )}
      <styles.AvatarsContainer ref={wheelRef}>{renderedAvatars}</styles.AvatarsContainer>
      <styles.AbsoluteContainer
        jackpotStarted={jackpotInfo && jackpotInfo.status === 'FINISHED' ? true : false}
      >
        {jackpotInfo && jackpotInfo.startedAt && (
          <Timer
            startedAt={jackpotInfo?.startedAt}
            duration={jackpotInfo?.jackpotDuration}
          />
        )}

        {jackpotInfo && jackpotInfo.bets.length === 0 && (
          <styles.AguardandoApostasText
            jackpotStarted={
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
