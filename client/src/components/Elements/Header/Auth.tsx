import React from 'react';
import { SiSteam } from 'react-icons/si';

import Button from '../Button';
import URLS, { PROTOCOL } from '../../../config/constants/URLS';

export default function Auth() {
  return (
    <div>
      <a
        href={`${PROTOCOL}${URLS.MAIN_URLS.API_URL}${URLS.ENDPOINTS.AUTH.steam.initial}`}
      >
        <Button btnType="CTA" label="Login" icon={<SiSteam />} />
      </a>
    </div>
  );
}
