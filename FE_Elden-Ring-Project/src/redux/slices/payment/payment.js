import { createSlice, combineReducers } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "paymentInfo",
  initialState: {
    paymentInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      cartId: "",
      total: "",
      paymentId: "",
    },
  },
  reducers: {
    setPaymentInfo(state, action) {
      state.paymentInfo = action.payload;
    },
  },
});

export const { setPaymentInfo } = paymentSlice.actions;

const paymentReducer = combineReducers({
  paymentInfo: paymentSlice.reducer,
});

export default paymentReducer;
