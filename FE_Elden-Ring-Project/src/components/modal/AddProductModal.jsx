import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import FileResizer from "react-image-file-resizer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import { toggleAddProductModal } from "../../redux/slices/modal/modal";
// import service
import * as ProductService from "../../service/product/product";
export const AddProductModal = () => {
  // ref
  const formRef = useRef(null);
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitData, setSubmitData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    cateId: "",
    status: true,
    productVariants: [
      { sizeName: "S", quantity: 0 },
      { sizeName: "M", quantity: 0 },
      { sizeName: "L", quantity: 0 },
    ],
  });
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["add-product"],
    mutationFn: ProductService.createProduct,
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Add product successful", {
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
  // file
  const resizeFile = (file) => {
    FileResizer.imageFileResizer(
      file,
      300,
      300,
      "PNG",
      300,
      0,
      (uri) => {
        setPreviewImage(uri);
        setSubmitData({
          ...submitData,
          image: uri,
        });
      },
      "base64",
      250,
      250
    );
  };
  //   handle func
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
    console.log(submitData);
  };
  const handleOnChangeFloat = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: parseFloat(value),
    });
  };
  const onChangeVariant = (sizeName, quantity) => {
    const updatedVariants = submitData.productVariants.map((variant) =>
      variant.sizeName === sizeName
        ? { ...variant, quantity: parseInt(quantity) }
        : variant
    );
    setSubmitData({
      ...submitData,
      productVariants: updatedVariants,
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
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
    if (isNaN(submitData.price)) {
      toast.error("Price and quantity must be number", {
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
    const hasInvalidQuantity = submitData.productVariants.some((variant) =>
      isNaN(variant.quantity)
    );
    if (hasInvalidQuantity) {
      toast.error("All variant quantities must be numbers", {
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
    if (
      !submitData.cateId ||
      !submitData.description ||
      !submitData.image ||
      !submitData.name ||
      !submitData.price
    ) {
      toast.error("Please input all fields", {
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
    if (submitData.name.trim() === "") {
      toast.error("Name cannot be empty", {
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
    if (submitData.description.trim() === "") {
      toast.error("Description cannot be empty", {
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
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  const handleToggleAddProductModal = () => {
    dispatch(toggleAddProductModal());
  };
  const removeChooseImage = () => {
    setPreviewImage(null);
    setSubmitData({
      ...submitData,
      image: "",
    });
  };
  return (
    <div className="add-product-modal-container">
      <ToastContainer />
      <div className="add-product-modal">
        <div className="header">
          <div>
            <i className="bx bxs-shopping-bag-alt"></i>
            <p>Add Product</p>
          </div>
          <i className="bx bx-x" onClick={handleToggleAddProductModal}></i>
        </div>
        <form
          action=""
          onSubmit={handleOnSubmit}
          ref={formRef}
          className="add-product-form"
        >
          <div className="input-image">
            <div>
              {previewImage ? (
                <>
                  <label htmlFor="image">
                    <img src={previewImage} alt="" />
                  </label>
                </>
              ) : (
                <>
                  <label htmlFor="image">
                    <i className="bx bx-image-add"></i>
                    <p>Click to choose image for product</p>
                  </label>
                </>
              )}
              <input
                type="file"
                name=""
                id="image"
                onChange={(e) => resizeFile(e.target.files[0])}
              />
            </div>
            <small onClick={removeChooseImage}>Clear the image</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Product name*</label>
            <input
              type="text"
              name="name"
              onChange={handleOnChange}
              placeholder="Enter product name..."
            />
            <small>Product name must at least 10 characters and clear</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Price*</label>
            <input
              type="text"
              name="price"
              onChange={handleOnChangeFloat}
              placeholder="Enter price..."
            />
            <small>Price must be number</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Size S</label>
            <input
              type="text"
              onChange={(e) => onChangeVariant("S", e.target.value)}
              placeholder="Enter quantity of size S..."
            />
            <small>Stock must be number(not required)</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Size M</label>
            <input
              type="text"
              onChange={(e) => onChangeVariant("M", e.target.value)}
              placeholder="Enter quantity of size M..."
            />
            <small>Stock must be number(not required)</small>
          </div>
          <div className="input-item">
            <label htmlFor="">Size L</label>
            <input
              type="text"
              onChange={(e) => onChangeVariant("L", e.target.value)}
              placeholder="Enter quantity of size L..."
            />
            <small>Stock must be number(not required)</small>
          </div>
          <div className="select-item">
            <label htmlFor="category">Categories*</label>
            <div>
              <select name="cateId" onChange={handleOnChange} id="category">
                <option value="">Select category</option>
                <option value="1">Bag</option>
                <option value="2">Ring</option>
                <option value="3">Watches</option>
                <option value="4">Necklace</option>
              </select>
              <i className="bx bx-chevron-down"></i>
            </div>
            <small>Select category for product</small>
          </div>
          <div className="input-description">
            <label htmlFor="">Description*</label>
            <textarea
              name="description"
              id=""
              onChange={handleOnChange}
              placeholder="Enter description..."
            ></textarea>
            <small>Max description is 255 characters</small>
          </div>
        </form>
        <div className="submit">
          <button onClick={handleToggleAddProductModal}>Return</button>
          <button onClick={handleExternalSubmit}>Confirm create product</button>
        </div>
      </div>
    </div>
  );
};
