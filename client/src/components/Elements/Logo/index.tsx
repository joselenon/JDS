import React, { useState, useEffect } from 'react';
import LogoDefault from './LogoDefault';
import LogoMobile from './LogoMobile';

export default function Logo() {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return <>{windowSize > 1000 ? <LogoDefault /> : <LogoMobile />}</>;
}
