import React, { memo } from 'react';

import * as styles from './styles';

const logo = require('../../../assets/images/saullo-coin.png');
import RedeemCode from '../Modals/RedeemCode';
import useGetBalance from '../../../hooks/useGetBalance';

function Balance() {
  const updatedBalance = useGetBalance();

  return (
    <styles.BalanceContainer>
      <styles.BalanceDisplayContainer>
        <styles.BalanceAndIcon>
          <img src={logo} width={18} height={18} />
          <span>{updatedBalance}</span>
        </styles.BalanceAndIcon>
        <RedeemCode />
      </styles.BalanceDisplayContainer>
    </styles.BalanceContainer>
  );
}

export default memo(Balance);
