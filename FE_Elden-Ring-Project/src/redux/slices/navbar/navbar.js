import { createSlice, combineReducers } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    isToggleNavbar: false,
  },
  reducers: {
    toggleNavbarOn: (state) => {
      state.isToggleNavbar = true;
    },
    toggleNavbarOff: (state) => {
      state.isToggleNavbar = false;
    },
    toggleNavbar: (state) => {
      state.isToggleNavbar = !state.isToggleNavbar;
    },
  },
});

const animateNavbarSlice = createSlice({
  name: "animateNavbar",
  initialState: {
    isToggleNavbar: false,
  },
  reducers: {
    toggleAnimateNavbarOn: (state) => {
      state.isToggleNavbar = true;
    },

    toggleAnimateNavbarOff: (state) => {
      state.isToggleNavbar = false;
    },
    toggleAnimateNavbar: (state) => {
      state.isToggleNavbar = !state.isToggleNavbar;
    },
  },
});
// export actions
export const { toggleNavbarOn, toggleNavbarOff, toggleNavbar } =
  navbarSlice.actions;
export const {
  toggleAnimateNavbarOn,
  toggleAnimateNavbarOff,
  toggleAnimateNavbar,
} = animateNavbarSlice.actions;
// combine reducers
const navbarReducers = combineReducers({
  navbar: navbarSlice.reducer,
  animateNavbar: animateNavbarSlice.reducer,
});

export default navbarReducers;
