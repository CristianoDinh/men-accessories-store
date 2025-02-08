import { createSlice, combineReducers } from "@reduxjs/toolkit";

const productIdSlice = createSlice({
  name: "productId",
  initialState: { productId: "" },
  reducers: {
    setProductId(state, action) {
      state.productId = action.payload;
    },
  },
});

export const { setProductId } = productIdSlice.actions;

const productReducers = combineReducers({
  productId: productIdSlice.reducer,
});

export default productReducers;
