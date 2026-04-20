import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import senseiReducer from '../features/senseiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    sensei: senseiReducer,
  },
});
