import React, { memo } from 'react';

import * as styles from './styles';

const logo = require('../../../assets/images/saullo-coin.png');
import RedeemCode from '../Modals/RedeemCode';
import useGetBalance from '../../../hooks/useGetBalance';

function Balance() {
  const updatedBalance = useGetBalance();

  const balanceAndIconStyle: React.CSSProperties = {
    filter: updatedBalance || updatedBalance === 0 ? 'none' : 'blur(3px)',
    userSelect: 'none',
    transition: 'all 0.25s',
  };

  return (
    <styles.BalanceContainer>
      <styles.BalanceDisplayContainer>
        <styles.BalanceAndIcon style={balanceAndIconStyle}>
          <img src={logo} width={18} height={18} />
          <span>{updatedBalance ? updatedBalance : 0}</span>
        </styles.BalanceAndIcon>
        <RedeemCode />
      </styles.BalanceDisplayContainer>
    </styles.BalanceContainer>
  );
}

export default memo(Balance);
