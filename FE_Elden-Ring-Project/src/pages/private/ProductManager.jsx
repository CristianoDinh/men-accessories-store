import React from "react";
import { useSelector } from "react-redux";
// import styles
import "../../styles/private/product/product.css";
// import components
import { Dashnav } from "../../components/navbar/Dashnav";
import { ProductList } from "../../components/private/product/ProductList";
import { AddProductModal } from "../../components/modal/AddProductModal";
import { UpdateProductModal } from "../../components/modal/UpdateProductModal";
import { DelProductModal } from "../../components/modal/DelProductModal";
export const ProductManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // selector
  const isToggleAddProductModal = useSelector(
    (state) => state.modal.addProductModal.isToggleModal
  );
  const isToggleUpdateProductModal = useSelector(
    (state) => state.modal.updateProductModal.isToggleModal
  );
  const isToggleDelProductModal = useSelector(
    (state) => state.modal.delProductModal.isToggleModal
  );
  return (
    <div className="product-manager-container">
      {isToggleDelProductModal && <DelProductModal />}
      {isToggleUpdateProductModal && <UpdateProductModal />}
      {isToggleAddProductModal && <AddProductModal />}
      <Dashnav />
      <div className="product-manager">
        <div className="header">
          <p>Product Manager</p>
          <div className="my-info">
            <i className="bx bx-user-circle"></i>
            <div>
              <strong>Hi, {user.fullName}</strong>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
        <ProductList />
      </div>
    </div>
  );
};
