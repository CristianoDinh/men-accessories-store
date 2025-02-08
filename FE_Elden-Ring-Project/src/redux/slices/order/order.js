import { createSlice, combineReducers } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orderInfo",
  initialState: {
    orderInfo: {},
  },
  reducers: {
    setOrderInfo(state, action) {
      state.orderInfo = action.payload;
    },
  },
});

export const { setOrderInfo } = orderSlice.actions;

const orderReducer = combineReducers({
  orderInfo: orderSlice.reducer,
});

export default orderReducer;
