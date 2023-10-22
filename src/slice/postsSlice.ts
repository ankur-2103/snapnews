import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface PostsState {
  posts: Post[]; // Adjust the user type based on your Supabase user structure
  myPosts: Post[];
  newsPosts: Post[];
}

const initialState: PostsState = {
  posts: [],
  myPosts: [],
  newsPosts:[]  
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setMyPosts: (state, action: PayloadAction<Post[]>) => {
      state.myPosts = action.payload;
    },
    setNewsPosts: (state, action: PayloadAction<Post[]>) => {
      state.newsPosts = action.payload;
    }
  },
});

export const { setPosts, setMyPosts, setNewsPosts } = postsSlice.actions;

export default postsSlice.reducer;