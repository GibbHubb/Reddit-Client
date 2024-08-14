// src/store/slices/commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch comments for a specific post
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId) => {
    const response = await axios.get(
      `https://www.reddit.com/comments/${postId}.json`
    );
    return response.data[1].data.children.map((child) => child.data);
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    toggleExpandComments: (state, action) => {
      const { postId } = action.payload;
      state.comments[postId].isExpanded = !state.comments[postId].isExpanded;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        state.status = 'succeeded';
        state.comments[postId] = {
          list: action.payload,
          isExpanded: false,
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { toggleExpandComments } = commentsSlice.actions;
export default commentsSlice.reducer;
