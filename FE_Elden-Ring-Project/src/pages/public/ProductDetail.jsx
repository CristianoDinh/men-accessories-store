import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/public/productdetail/productdetail.css";
// import components
import { Navbar } from "../../components/navbar/Navbar";
import { AdvanceNavbar } from "../../components/navbar/AdvanceNavbar";
import { Footer } from "../../components/footer/Footer";
// import service
import * as CartService from "../../service/cart/cart";
import * as ProductService from "../../service/product/product";
export const ProductDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const token = localStorage.getItem("token");
  const { productId } = useParams();
  // navigate
  const navigate = useNavigate();
  // state
  const [selectedSize, setSelectedSize] = useState({
    sizeName: "",
  });
  const [submitData, setSubmitData] = useState({
    quantity: 1,
    sizeName: "",
  });
  // query
  const { data: productInfo = {} } = useQuery({
    queryKey: ["productInfo", productId],
    queryFn: () => ProductService.getProductDetail(productId),
  });
  const { data: cartInfo = {} } = useQuery({
    queryKey: ["my-cart"],
    queryFn: () => CartService.getMyCart(userId),
  });
  // mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["add-to-cart"],
    mutationFn: ({ cartId, productId, data }) =>
      CartService.addToCart(cartId, productId, data),
    onSuccess: (response) => {
      if (response?.code === "QUANTITY_EXCEEDS_STOCK") {
        toast.error(
          "Sorry you can't add to cart because this size is out of stock",
          {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { width: "400px" },
          }
        );
      } else {
        queryClient.invalidateQueries(["my-cart"]);
        queryClient.invalidateQueries(["productInfo"]);
        queryClient.refetchQueries(["my-cart"]);
        toast.success("Added to your cart", {
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
      }
    },
  });
  // handle func
  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
    setSelectedSize({
      sizeName: value,
    });
  };
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const handleBuynow = (productId) => {
    if (user.role === "ADMIN") {
      toast.error("Admins are not allowed to purchase products", {
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
    if (!selectedSize.sizeName) {
      toast.error("Please choose product size", {
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
    navigate(`/buynow/${productId}`);
  };
  const handleAddToCart = debounce(async () => {
    if (user.role === "ADMIN") {
      toast.error("Admins are not allowed to add products to the cart", {
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
    if (!submitData.sizeName) {
      toast.error("Please choose product size", {
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
    try {
      await mutation.mutateAsync({
        cartId: cartInfo.cartId,
        productId,
        data: {
          data: submitData,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, 200);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  return (
    <div className="product-detail-container">
      <ToastContainer />
      <Navbar />
      <AdvanceNavbar />
      <div className="product-detail">
        <div className="product-image">
          <img src={productInfo?.image} alt="" />
        </div>
        <div className="product-main-info">
          <span>{productInfo?.cateName} Category</span>
          <strong>{productInfo?.name}</strong>
          <p>{formatPrice(productInfo.price)}</p>
          <div className="size">
            <label className="label" htmlFor="">
              Size
            </label>
            <div className="size-list">
              {!user && !token ? (
                <>
                  {productInfo?.productVariants?.map((variant) => (
                    <div className="size-item" key={variant.sizeName}>
                      <input
                        type="radio"
                        id={`size${variant.sizeName}`}
                        name="sizeName"
                        value={variant.sizeName}
                        disabled
                      />
                      <label
                        className="out-of-stock"
                        htmlFor={`size${variant.sizeName}`}
                      >
                        Size {variant.sizeName}
                      </label>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {productInfo?.productVariants?.map((variant) => (
                    <div className="size-item" key={variant.sizeName}>
                      <input
                        type="radio"
                        id={`size${variant.sizeName}`}
                        name="sizeName"
                        onChange={handleSizeChange}
                        value={variant.sizeName}
                        disabled={variant.quantity === 0}
                      />
                      <label
                        className={variant.quantity === 0 && "out-of-stock"}
                        htmlFor={`size${variant.sizeName}`}
                      >
                        Size {variant.sizeName}
                      </label>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="buttons">
            {!user && !token ? (
              <>
                <Link to="/login">You have to Login to buy this product!</Link>
              </>
            ) : (
              <>
                <button style={{ cursor: "pointer" }} onClick={handleAddToCart}>
                  Add To Cart
                </button>
                <Link
                  onClick={() => handleBuynow(productInfo?.productId)}
                  state={{
                    productInfo: productInfo,
                    selectedSize: selectedSize.sizeName,
                  }}
                >
                  Buy Now
                </Link>
              </>
            )}
          </div>
          <div className="note">
            <p>
              If the product you are interested in appears out of stock on the
              website. Please INBOX directly to EldenRing for the fastest
              support. Thank you very much!
            </p>
          </div>
        </div>
      </div>
      <div className="description">
        <div className="header">
          <strong>Product Description</strong>
        </div>
        <div className="main">
          <p>{productInfo?.description}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
