import { createSlice } from '@reduxjs/toolkit';
import IServerState from '../../config/interfaces/IServerState';

const initialState: IServerState = {
  isOn: false,
};

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServerStatus: (state, action) => {
      state.isOn = action.payload;
    },
  },
});

export const { setServerStatus } = serverSlice.actions;
export default serverSlice.reducer;
