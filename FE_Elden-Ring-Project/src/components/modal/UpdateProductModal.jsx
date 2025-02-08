import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FileResizer from "react-image-file-resizer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import { toggleUpdateProductModal } from "../../redux/slices/modal/modal";
// import service
import * as ProductService from "../../service/product/product";
import { ClipLoader } from "react-spinners";
export const UpdateProductModal = () => {
  // use ref
  const formRef = useRef(null);
  // dispatch
  const dispatch = useDispatch();
  // selector
  const productId = useSelector((state) => state.product.productId.productId);
  // state
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isPreventSubmit, setIsPreventSubmit] = useState(false);
  const [submitData, setSubmitData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    cateId: "",
    status: "",
    productVariants: [
      { sizeName: "S", quantity: 0 },
      { sizeName: "M", quantity: 0 },
      { sizeName: "L", quantity: 0 },
    ],
  });
  // query
  const {
    data: productInfo = {},
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: () => ProductService.getProductDetail(productId),
  });
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["update-product", productId],
    mutationFn: (updateData) => {
      ProductService.updateProduct(productId, updateData);
    },
    onMutate: () => {
      setIsPreventSubmit(true);
    },
    onSuccess: () => {
      toast.success("Update product successful", {
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
    if (!file) return;
    FileResizer.imageFileResizer(
      file,
      300,
      300,
      "PNG",
      300,
      0,
      (uri) => {
        setPreviewImage(uri);
        setSubmitData((prevData) => ({
          ...prevData,
          image: uri,
        }));
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
  const removeChooseImage = () => {
    setPreviewImage(null);
    setSubmitData({
      ...submitData,
      image: "",
    });
  };
  const handleToggleUpdateProductModal = () => {
    dispatch(toggleUpdateProductModal());
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
    const hasInvalidQuantity = submitData.productVariants.some(
      (variant) =>
        variant.quantity === "" ||
        variant.quantity === null ||
        isNaN(Number(variant.quantity))
    );
    if (hasInvalidQuantity) {
      toast.error("All variant quantities must be numbers", {
        position: "top-center",
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
      submitData.cateId === "" ||
      submitData.description === "" ||
      submitData.image === "" ||
      submitData.name === "" ||
      submitData.price === "" ||
      submitData.status === ""
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
  useEffect(() => {
    if (isFetching || isLoading) {
      setIsLoadingModal(true);
    } else {
      setIsLoadingModal(false);
    }
    if (productInfo) {
      setSubmitData({
        name: productInfo?.name || "",
        description: productInfo?.description || "",
        image: productInfo?.image || "",
        price: productInfo?.price || "",
        cateId: productInfo?.cateId || "",
        status: productInfo?.status || "",
        productVariants: productInfo?.productVariants || [
          { sizeName: "S", quantity: 0 },
          { sizeName: "M", quantity: 0 },
          { sizeName: "L", quantity: 0 },
        ],
      });
      if (productInfo.image) {
        setPreviewImage(productInfo?.image);
      }
    }
  }, [isFetching, isLoading]);
  return (
    <div className="update-product-modal-container">
      <ToastContainer />
      {isLoadingModal ? (
        <>
          <div className="loading">
            <ClipLoader color="#ffffff" size={50} />
          </div>
        </>
      ) : (
        <>
          <div className="update-product-modal">
            <div className="header">
              <div>
                <i className="bx bxs-shopping-bag-alt"></i>
                <p>Update Product</p>
              </div>
              <i
                className="bx bx-x"
                onClick={handleToggleUpdateProductModal}
              ></i>
            </div>
            <form
              action=""
              onSubmit={handleOnSubmit}
              ref={formRef}
              className="update-product-form"
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
                  defaultValue={submitData.name}
                  placeholder="Enter product name..."
                />
                <small>
                  Product name must at least 10 characters and clear
                </small>
              </div>
              <div className="input-item">
                <label htmlFor="">Price*</label>
                <input
                  type="text"
                  name="price"
                  onChange={handleOnChangeFloat}
                  defaultValue={submitData.price}
                  placeholder="Enter price..."
                />
                <small>Price must be number</small>
              </div>
              <div className="input-item">
                <label htmlFor="">Size S</label>
                <input
                  type="text"
                  defaultValue={
                    submitData.productVariants.find((v) => v.sizeName === "S")
                      ?.quantity || 0
                  }
                  placeholder="Enter quantity of size S..."
                  onChange={(e) => onChangeVariant("S", e.target.value)}
                />
                <small>Stock must be number(not required)</small>
              </div>
              <div className="input-item">
                <label htmlFor="">Size M</label>
                <input
                  type="text"
                  defaultValue={
                    submitData.productVariants.find((v) => v.sizeName === "M")
                      ?.quantity || 0
                  }
                  placeholder="Enter quantity of size M..."
                  onChange={(e) => onChangeVariant("M", e.target.value)}
                />
                <small>Stock must be number(not required)</small>
              </div>
              <div className="input-item">
                <label htmlFor="">Size L</label>
                <input
                  type="text"
                  defaultValue={
                    submitData.productVariants.find((v) => v.sizeName === "L")
                      ?.quantity || 0
                  }
                  placeholder="Enter quantity of size L..."
                  onChange={(e) => onChangeVariant("L", e.target.value)}
                />
                <small>Stock must be number(not required)</small>
              </div>
              <div className="select-item">
                <label htmlFor="category">Categories*</label>
                <div>
                  <select
                    name="cateId"
                    onChange={handleOnChange}
                    defaultValue={submitData.cateId}
                    id="category"
                  >
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
              <div className="select-item">
                <label htmlFor="category">Status*</label>
                <div>
                  <select
                    name="status"
                    onChange={handleOnChange}
                    defaultValue={submitData.status ? "true" : "false"}
                    id="category"
                  >
                    <option value="">Set product status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
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
                  placeholder="Enter description..."
                  defaultValue={submitData.description}
                  onChange={handleOnChange}
                ></textarea>
                <small>Max description is 255 characters</small>
              </div>
            </form>
            <div className="submit">
              <button onClick={handleToggleUpdateProductModal}>Return</button>
              <button onClick={handleExternalSubmit}>
                Confirm update product
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
