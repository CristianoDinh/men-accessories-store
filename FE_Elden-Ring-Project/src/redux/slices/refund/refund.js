import { createSlice, combineReducers } from "@reduxjs/toolkit";

const refundSlice = createSlice({
  name: "refundInfo",
  initialState: {
    refundInfo: {},
  },
  reducers: {
    setRefundInfo(state, action) {
      state.refundInfo = action.payload;
    },
  },
});

export const { setRefundInfo } = refundSlice.actions;

const refundReducer = combineReducers({
  refundInfo: refundSlice.reducer,
});

export default refundReducer;
