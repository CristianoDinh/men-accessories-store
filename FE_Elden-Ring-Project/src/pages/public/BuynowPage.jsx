import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/public/buynow/buynow.css";
// import components
import { Navbar } from "../../components/navbar/Navbar";
import { AdvanceNavbar } from "../../components/navbar/AdvanceNavbar";
import { Footer } from "../../components/footer/Footer";
// import service
import * as PaymentService from "../../service/payment/payment";
import { SyncLoader } from "react-spinners";
export const BuynowPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { productInfo, selectedSize } = location.state;
  // state
  const [quantity, setQuantity] = useState(1);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [submitData, setSubmitData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    total: "",
    productId: "",
    size: "",
    quantity: "",
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["buynow"],
    mutationFn: PaymentService.createBuynow,
    onMutate: () => {
      setIsLoadingPage(true);
    },
    onSuccess: (response) => {
      if (response?.code === "PRODUCT_VARIANT_NOT_ENOUGH_STOCK") {
        toast.error(
          "This size is out of stock for now, please choose another item.",
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
        setIsLoadingPage(false);
      } else {
        setIsLoadingPage(false);
      }
    },
  });
  // handle func
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };
  const handlePlus = () => {
    setQuantity(quantity + 1);
  };
  const handleMinus = () => {
    if (quantity <= 1) {
      setQuantity(1);
      return;
    }
    setQuantity(quantity - 1);
  };
  const handleBuynow = async () => {
    if (
      submitData.address === "" ||
      submitData.email === "" ||
      submitData.fullname === "" ||
      submitData.phone === ""
    ) {
      toast.error("Please input all fields", {
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
    if (submitData.phone.length > 10) {
      toast.error("Phone number too long, please input valid phone number", {
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
      const totalPrice = parseFloat((productInfo.price * quantity).toFixed(2));
      const updatedSubmitData = {
        ...submitData,
        total: totalPrice,
        quantity,
      };
      localStorage.setItem("paymentInfo", JSON.stringify(updatedSubmitData));
      await mutation.mutateAsync(updatedSubmitData);
    } catch (error) {
      console.log(error);
    }
  };
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  useEffect(() => {
    if (user && token) {
      setSubmitData({
        ...submitData,
        fullname: user.fullName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
        quantity: quantity,
        size: selectedSize || "",
        productId: productInfo.productId || "",
      });
    }
  }, []);
  const calculateTotalItemPrice = (price, quantity) => {
    return price * quantity;
  };
  return (
    <div className="buynow-container">
      {isLoadingPage && (
        <div className="loading">
          <SyncLoader margin={5} size={20} color="#ffffff" />
        </div>
      )}
      <ToastContainer />
      <Navbar />
      <AdvanceNavbar />
      <div className="buynow">
        <form action="" autoComplete="off" className="info-form">
          <div className="header">
            <strong>Delivery Infomation</strong>
          </div>
          <div className="input-item">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="fullname"
              defaultValue={user?.fullName || ""}
              onChange={handleOnChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Email</label>
            <input
              type="text"
              name="email"
              disabled
              defaultValue={user?.email || ""}
              onChange={handleOnChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Address</label>
            <input
              type="text"
              name="address"
              defaultValue={user?.address || ""}
              onChange={handleOnChange}
              placeholder="Enter your address"
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Phone</label>
            <input
              type="text"
              name="phone"
              defaultValue={user?.phone || ""}
              onChange={handleOnChange}
              placeholder="Enter your phone"
            />
          </div>
        </form>
        <div className="summary">
          <div className="header">
            <strong>Order Summary</strong>
          </div>
          <div className="cart-list">
            <div className="cart-item">
              <div className="main">
                <img src={productInfo.image} alt="" />
                <div>
                  <strong>{productInfo.name}</strong>
                  <p>Size {selectedSize}</p>
                  <span>{formatPrice(productInfo.price)}</span>
                </div>
              </div>
              <div className="quantity">
                <p onClick={handleMinus}>-</p>
                <p>{quantity}</p>
                <p onClick={handlePlus}>+</p>
              </div>
            </div>
          </div>
          <div className="total">
            <div className="subtotal">
              <div className="item">
                <p>Subtotal</p>
                <strong>
                  {formatPrice(
                    calculateTotalItemPrice(productInfo.price, quantity)
                  )}
                </strong>
              </div>
              <div className="item">
                <p>Shipping</p>
                <strong>Free</strong>
              </div>
            </div>
            <div className="confirm">
              <div>
                <strong>Total</strong>
                <strong>
                  {formatPrice(
                    calculateTotalItemPrice(productInfo.price, quantity)
                  )}
                </strong>
              </div>
              <button onClick={handleBuynow}>
                Confirm Pay{" "}
                {formatPrice(
                  calculateTotalItemPrice(productInfo.price, quantity)
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
