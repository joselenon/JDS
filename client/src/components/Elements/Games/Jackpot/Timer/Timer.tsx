// Replace props variables names into generic ones (turn into a generic component)

import React, { useRef, useState, useEffect } from 'react';

interface ITimerProps {
  startedAt: number | undefined;
  duration: number | undefined;
}

export default function Timer(props: ITimerProps) {
  const { startedAt, duration } = props;
  const totalMS = useRef<any>(0);
  const intervalRef = useRef<any>(null);

  const [msLeftToClose, setMSLeftToClose] = useState(totalMS.current);
  const [timerState, setTimerState] = useState(totalMS.current);

  function startTimer() {
    const timerSpeed = 10;
    clearInterval(intervalRef.current);
    if (startedAt) {
      intervalRef.current = setInterval(() => {
        if (totalMS.current <= 0) {
          clearInterval(intervalRef.current);
          setTimerState(0);
          totalMS.current = msLeftToClose;
        } else {
          const newTotalMS = totalMS.current - timerSpeed;
          totalMS.current = newTotalMS;
          setTimerState(newTotalMS);
        }
      }, timerSpeed);
    }
  }

  const calculateMSLeftToCloseJackpot = () => {
    if (!startedAt) return 0;
    if (!duration) return 0;
    const nowTime = new Date().getTime();
    const nowTimeToStartedAtDif = nowTime - Number(startedAt);
    const msLeftToClose = duration - nowTimeToStartedAtDif;
    return msLeftToClose > 0 ? msLeftToClose : 0;
  };

  useEffect(() => {
    setMSLeftToClose(calculateMSLeftToCloseJackpot());
    totalMS.current = msLeftToClose;
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [startedAt, msLeftToClose]);

  return (
    <span>
      {timerState % 1000 === 0
        ? `${timerState / 1000}:00`
        : `${Math.floor(timerState / 1000)}:${String(
            Math.floor((timerState / 10) % 100),
          ).padStart(2, '0')}`}
    </span>
  );
}
