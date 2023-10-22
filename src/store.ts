// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice.ts';
import postsReducer from './slice/postsSlice.ts';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
