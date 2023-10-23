// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice.ts';
import postsReducer from './slice/postsSlice.ts';

//Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer
  },
});

//Redux state
export type RootState = ReturnType<typeof store.getState>;

// Redux dispatch
export type AppDispatch = typeof store.dispatch;

export default store;
