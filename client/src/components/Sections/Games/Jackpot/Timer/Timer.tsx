// Remake variables into generic ones (startedAt)

import React, { useRef, useState, useEffect, CSSProperties } from 'react';

interface ITimerProps {
  startedAt: number | undefined;
  duration: number | undefined;
  style?: CSSProperties;
}

export default function Timer(props: ITimerProps) {
  const { startedAt, duration = 0, style } = props;

  const totalMS = useRef<any>(0);
  const intervalRef = useRef<any>(null);

  const [msLeftToClose, setMSLeftToClose] = useState(totalMS.current);
  const [timerState, setTimerState] = useState(totalMS.current);

  function startTimer() {
    const timerSpeed = 10;
    clearInterval(intervalRef.current);
    if (startedAt) {
      console.log('aquio');
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

  console.log(startedAt);

  return (
    // Temporary (width: '103px') //
    <div style={{ width: '103px' }}>
      {startedAt ? (
        <h2 style={style}>
          {timerState % 1000 === 0
            ? `${timerState / 1000}:00`
            : `${Math.floor(timerState / 1000)}:${String(
                Math.floor((timerState / 10) % 100),
              ).padStart(2, '0')}`}
        </h2>
      ) : (
        <h2 style={style}>{`${duration / 1000}:00`}</h2>
      )}
    </div>
  );
}
