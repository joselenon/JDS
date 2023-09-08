import { configureStore } from '@reduxjs/toolkit';

import authSlice from './features/authSlice';
import serverSlice from './features/serverSlice';

const reduxStore = configureStore({
  reducer: {
    auth: authSlice,
    server: serverSlice,
  },
});

export default reduxStore;

export type RootState = ReturnType<typeof reduxStore.getState>;
