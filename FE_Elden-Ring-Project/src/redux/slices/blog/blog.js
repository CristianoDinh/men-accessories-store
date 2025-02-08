import { createSlice, combineReducers } from "@reduxjs/toolkit";

const blogIdSlice = createSlice({
  name: "blogId",
  initialState: { blogId: "" },
  reducers: {
    setBlogId(state, action) {
      state.blogId = action.payload;
    },
  },
});

export const { setBlogId } = blogIdSlice.actions;

const blogReducers = combineReducers({
  blogId: blogIdSlice.reducer,
});

export default blogReducers;
