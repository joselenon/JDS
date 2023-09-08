import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import decodeJWT from '../../common/jwtDecoder';
import IAuthState from '../../config/interfaces/IAuthState';
import AxiosService from '../../services/AxiosService';
import { IUserJWTPayload } from '../../config/interfaces/IUser';

const initialState: IAuthState = {
  userInfo: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      action.payload && AxiosService.setToken(action.payload);
      if (!action.payload) return (state.userInfo = undefined);
      const userInfo: IUserJWTPayload | undefined = decodeJWT<IAuthState['userInfo']>(
        action.payload,
      );
      state.userInfo = userInfo;
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
