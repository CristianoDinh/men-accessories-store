import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import { toggleDelProductModal } from "../../redux/slices/modal/modal";
// import service
import * as ProductService from "../../service/product/product";
export const DelProductModal = () => {
  // selector
  const productId = useSelector((state) => state.product.productId.productId);
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  // dispatch
  const dispatch = useDispatch();
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["delete-product"],
    mutationFn: ProductService.deleteProduct,
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Delete product successful", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        setIsPreventSubmit(false);
        location.reload();
      }, 1500);
      queryClient.invalidateQueries(["products"]);
    },
  });
  // handle func
  const handleDelProduct = async () => {
    if (isPreventSubmit) {
      toast.error("On processing, try again!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "400px" },
      });
      return;
    }
    try {
      await mutation.mutateAsync(productId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggleDelProductModal = () => {
    dispatch(toggleDelProductModal());
  };
  return (
    <div className="del-product-modal-container">
      <ToastContainer />
      <div className="del-product-modal">
        <i className="bx bxs-error"></i>
        <strong>Delete Product</strong>
        <p>You're going to delete this product. Are you sure?</p>
        <span>Product ID: {productId}</span>
        <div className="button">
          <button onClick={handleToggleDelProductModal}>No, Keep it.</button>
          <button onClick={handleDelProduct}>Yes, Delete!</button>
        </div>
      </div>
    </div>
  );
};
