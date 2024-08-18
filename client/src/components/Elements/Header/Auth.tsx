import React from 'react';
import { useDispatch } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SiGoogle, SiSteam } from 'react-icons/si';

import Button from '../Button';
import URLS from '../../../config/constants/URLS';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import AxiosService from '../../../services/AxiosService';
import { setToken } from '../../../redux/features/authSlice';
import { firebaseApp } from '../../../services/FirebaseService';
import { JWTCookie } from '../../../config/app/CookiesConfig';
import Cookies from 'js-cookie';

export default function Auth() {
  const dispatch = useDispatch();

  async function handleGoogleSignIn() {
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();

      const x: any = await signInWithPopup(auth, provider);
      const { user } = x;
      const { accessToken } = user;

      const res = await AxiosService.post<string>(URLS.ENDPOINTS.AUTH.google, {
        accessToken,
      });
      if (res?.data.success && res.data.data) {
        Cookies.set(JWTCookie.key, res.data.data, JWTCookie.config);
        dispatch(setToken(res.data.data));
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {/*
      <a href={`${URLS.MAIN_URLS.API_URL}${URLS.ENDPOINTS.AUTH.steam.initial}`}>
        <Button
          btnType="CTA"
          label="Login"
          icon={{ provider: 'reactIcons', element: SiSteam }}
        />
      </a>
      */}

      <Button
        btnType="CTA"
        label="Login"
        icon={{ provider: 'reactIcons', element: SiGoogle }}
        attributes={{ onClick: handleGoogleSignIn }}
      />
    </div>
  );
}
