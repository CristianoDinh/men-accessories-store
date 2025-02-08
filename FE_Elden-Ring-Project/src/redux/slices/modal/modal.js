import { createSlice, combineReducers } from "@reduxjs/toolkit";

// add
const AddProductSlice = createSlice({
  name: "addProductModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleAddProductModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
const AddAccountSlice = createSlice({
  name: "addAccountModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleAddAccountModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
const AddBlogSlice = createSlice({
  name: "addBlogModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleAddBlogModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
// update
const UpdateProductSlice = createSlice({
  name: "updateProductModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleUpdateProductModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
const UpdateBlogSlice = createSlice({
  name: "updateBlogModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleUpdateBlogModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
// delete
const DelProductSlice = createSlice({
  name: "delProductModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleDelProductModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
const blockAccountSlice = createSlice({
  name: "blockAccountModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleBlockAccountModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
const unblockAccountSlice = createSlice({
  name: "unblockAccountModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleUnblockAccountModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
const DelBlogSlice = createSlice({
  name: "delBlogModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleDelBlogModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
const cancelOrderSlice = createSlice({
  name: "cancelOrderModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleCancelOrderModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
// detail
const previewBlogSlice = createSlice({
  name: "previewBlogModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    togglePreviewBlogModalOn: (state) => {
      state.isToggleModal = true;
    },
    togglePreviewBlogModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const animateBlogModalSlice = createSlice({
  name: "animateBlogModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleAnimateBlogModalOn: (state) => {
      state.isToggleModal = true;
    },
    toggleAnimateBlogModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const previewOrderSlice = createSlice({
  name: "previewOrderModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    togglePreviewOrderModalOn: (state) => {
      state.isToggleModal = true;
    },
    togglePreviewOrderModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const animateOrderModalSlice = createSlice({
  name: "animateOrderModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleAnimateOrderModalOn: (state) => {
      state.isToggleModal = true;
    },
    toggleAnimateOrderModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const previewRefundSlice = createSlice({
  name: "previewRefundModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    togglePreviewRefundModalOn: (state) => {
      state.isToggleModal = true;
    },
    togglePreviewRefundModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const animateRefundModalSlice = createSlice({
  name: "animateRefundModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleAnimateRefundModalOn: (state) => {
      state.isToggleModal = true;
    },
    toggleAnimateRefundModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const previewMyOrderSlice = createSlice({
  name: "previewMyOrderModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    togglePreviewMyOrderModalOn: (state) => {
      state.isToggleModal = true;
    },
    togglePreviewMyOrderModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const animateMyOrderModalSlice = createSlice({
  name: "animateMyOrderModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleAnimateMyOrderModalOn: (state) => {
      state.isToggleModal = true;
    },
    toggleAnimateMyOrderModalOff: (state) => {
      state.isToggleModal = false;
    },
  },
});
const refundRequestSlice = createSlice({
  name: "refundRequestModal",
  initialState: {
    isToggleModal: false,
  },
  reducers: {
    toggleRefundRequestModal: (state) => {
      state.isToggleModal = !state.isToggleModal;
    },
  },
});
// export actions
export const { toggleAddProductModal } = AddProductSlice.actions;
export const { toggleUpdateProductModal } = UpdateProductSlice.actions;
export const { toggleDelProductModal } = DelProductSlice.actions;
export const { toggleAddAccountModal } = AddAccountSlice.actions;
export const { toggleBlockAccountModal } = blockAccountSlice.actions;
export const { toggleUnblockAccountModal } = unblockAccountSlice.actions;
export const { toggleCancelOrderModal } = cancelOrderSlice.actions;
export const { toggleRefundRequestModal } = refundRequestSlice.actions;
export const { togglePreviewBlogModalOn, togglePreviewBlogModalOff } =
  previewBlogSlice.actions;
export const { toggleAnimateBlogModalOn, toggleAnimateBlogModalOff } =
  animateBlogModalSlice.actions;
export const { togglePreviewOrderModalOn, togglePreviewOrderModalOff } =
  previewOrderSlice.actions;
export const { toggleAnimateOrderModalOn, toggleAnimateOrderModalOff } =
  animateOrderModalSlice.actions;
export const { toggleAddBlogModal } = AddBlogSlice.actions;
export const { toggleUpdateBlogModal } = UpdateBlogSlice.actions;
export const { toggleDelBlogModal } = DelBlogSlice.actions;
export const { togglePreviewMyOrderModalOn, togglePreviewMyOrderModalOff } =
  previewMyOrderSlice.actions;
export const { toggleAnimateMyOrderModalOn, toggleAnimateMyOrderModalOff } =
  animateMyOrderModalSlice.actions;
export const { togglePreviewRefundModalOn, togglePreviewRefundModalOff } =
  previewRefundSlice.actions;
export const { toggleAnimateRefundModalOn, toggleAnimateRefundModalOff } =
  animateRefundModalSlice.actions;
// combine reducer
const modalReducers = combineReducers({
  addProductModal: AddProductSlice.reducer,
  updateProductModal: UpdateProductSlice.reducer,
  delProductModal: DelProductSlice.reducer,
  addAccountModal: AddAccountSlice.reducer,
  blockAccountModal: blockAccountSlice.reducer,
  previewBlogModal: previewBlogSlice.reducer,
  animateBlogModal: animateBlogModalSlice.reducer,
  addBlogModal: AddBlogSlice.reducer,
  updateBlogModal: UpdateBlogSlice.reducer,
  delBlogModal: DelBlogSlice.reducer,
  previewOrderModal: previewOrderSlice.reducer,
  animateOrderModal: animateOrderModalSlice.reducer,
  previewMyOrderModal: previewMyOrderSlice.reducer,
  animateMyOrderModal: animateMyOrderModalSlice.reducer,
  previewRefundModal: previewRefundSlice.reducer,
  animateRefundModal: animateRefundModalSlice.reducer,
  cancelOrderModal: cancelOrderSlice.reducer,
  refundRequestModal: refundRequestSlice.reducer,
  unblockAccountModal: unblockAccountSlice.reducer,
});
export default modalReducers;
