// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// User type
export interface User{
  id: string;
  user_name:string;
  following:string[];
  photo: string;
  saved: string[];
  notifications: any[];
}

// Auth type
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    addFollowing: (state, action: PayloadAction<string>) => {
      state.user!.following = state.user!.following === null ? [action.payload] : state.user!.following.concat([action.payload])
    },
    removeFollowing: (state, action: PayloadAction<string>) => {
      state.user!.following = state.user!.following.filter(val => val!==action.payload)
    },
    addSavedPost: (state, action: PayloadAction<string>) => {
      state.user!.saved = state.user!.saved === null ? [action.payload] : state.user!.saved.concat([action.payload])
    },
    removeSavedPost: (state, action: PayloadAction<string>) => {
      state.user!.saved = state.user!.saved.filter(val => val!==action.payload)
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout, addFollowing, removeFollowing, addSavedPost, removeSavedPost } = authSlice.actions;

export default authSlice.reducer;
