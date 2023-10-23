import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// post type
export interface Post{
  id: string,
  description: string ,
  createdAt: Date ,
  user_id: string ,
  user_name: string ,
  user_photo: string ,
  photo: string ,
  tags: string[],
  likes: string[]
}

// slice state
interface PostsState {
  myPosts: Post[];
  newsPosts: Post[];
}

// initial state
const initialState: PostsState = {
  myPosts: [],
  newsPosts:[]  
};

// post slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setMyPosts: (state, action: PayloadAction<Post[]>) => {
      state.myPosts = action.payload;
    },
    setNewsPosts: (state, action: PayloadAction<Post[]>) => {
      state.newsPosts = action.payload;
    }
  },
});

export const { setMyPosts, setNewsPosts } = postsSlice.actions;

export default postsSlice.reducer;