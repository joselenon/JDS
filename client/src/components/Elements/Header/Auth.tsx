import React from 'react';
import { SiSteam } from 'react-icons/si';

import Button from '../Button';
import URLS from '../../../config/constants/URLS';

export default function Auth() {
  return (
    <div>
      <a href={`${URLS.MAIN_URLS.API_URL}${URLS.ENDPOINTS.AUTH.steam.initial}`}>
        <Button btnType="CTA" label="Login" icon={<SiSteam />} />
      </a>
    </div>
  );
}
