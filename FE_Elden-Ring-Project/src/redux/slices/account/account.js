import { createSlice, combineReducers } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: { email: "" },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
  },
});
const otpSlice = createSlice({
  name: "otp",
  initialState: { otp: "" },
  reducers: {
    setOtp(state, action) {
      state.otp = action.payload;
    },
  },
});
const accountInfoSlice = createSlice({
  name: "accountInfo",
  initialState: {
    accountInfo: {},
  },
  reducers: {
    setAccountInfo(state, action) {
      state.accountInfo = action.payload;
    },
  },
});
export const { setEmail } = emailSlice.actions;
export const { setOtp } = otpSlice.actions;
export const { setAccountInfo } = accountInfoSlice.actions;

const accountReducers = combineReducers({
  email: emailSlice.reducer,
  otp: otpSlice.reducer,
  accountInfo: accountInfoSlice.reducer,
});

export default accountReducers;
