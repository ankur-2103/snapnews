// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User{
  id: string;
  user_name:string;
  following:string[];
  photo: string;
  saved: string[];
  notifications: any[];
}

interface AuthState {
  user: User | null; // Adjust the user type based on your Supabase user structure
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

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
