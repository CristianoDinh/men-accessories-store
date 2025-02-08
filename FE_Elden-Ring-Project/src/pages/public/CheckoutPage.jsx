import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/public/checkout/checkout.css";
// import components
import { Navbar } from "../../components/navbar/Navbar";
import { AdvanceNavbar } from "../../components/navbar/AdvanceNavbar";
import { Footer } from "../../components/footer/Footer";
// import service
import * as CartService from "../../service/cart/cart";
import * as PaymentService from "../../service/payment/payment";
import { SyncLoader } from "react-spinners";
export const CheckoutPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  // state
  const [cartList, setCartList] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [submitData, setSubmitData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    total: "",
    cartId: "",
  });
  // query
  const { data: cartInfo } = useQuery({
    queryKey: ["my-cart"],
    queryFn: () => CartService.getMyCart(user?.userId),
  });
  // mutation
  const mutation = useMutation({
    mutationKey: ["checkout"],
    mutationFn: PaymentService.createCheckout,
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
  const totalTotalCartValue = () => {
    return Array.isArray(cartList)
      ? cartList.reduce((total, item) => {
          return total + (item.quantity || 0) * (item.product.price || 0);
        }, 0)
      : 0;
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };
  const handleCheckout = async () => {
    if (
      submitData.address === "" ||
      submitData.email === "" ||
      submitData.fullName === "" ||
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
    if (submitData.fullName.trim() === "") {
      toast.error("Full name cannot be only spaces", {
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
      submitData.phone.length < 8 ||
      submitData.phone.length > 11 ||
      !/^0\d+$/.test(submitData.phone)
    ) {
      toast.error("Please input valid phone number", {
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
      const totalPrice = totalTotalCartValue();
      const updatedSubmitData = {
        ...submitData,
        total: totalPrice,
      };
      localStorage.setItem("paymentInfo", JSON.stringify(updatedSubmitData));
      await mutation.mutateAsync(updatedSubmitData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (cartInfo) {
      setCartList(cartInfo.cartItems);
    }
    if (user && token) {
      setSubmitData({
        ...submitData,
        fullName: user.fullName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
        cartId: cartInfo?.cartId || "",
      });
    }
  }, [cartInfo, cartList]);
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <div className="checkout-container">
      {isLoadingPage && (
        <div className="loading">
          <SyncLoader margin={5} size={20} color="#ffffff" />
        </div>
      )}
      <ToastContainer />
      <Navbar />
      <AdvanceNavbar />
      <div className="checkout">
        <form action="" autoComplete="off" className="info-form">
          <div className="header">
            <strong>Delivery Infomation</strong>
          </div>
          <div className="input-item">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="fullName"
              onChange={handleOnChange}
              defaultValue={user?.fullName || ""}
              placeholder="Enter your name"
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Email</label>
            <input
              type="text"
              onChange={handleOnChange}
              disabled
              defaultValue={user?.email || ""}
              name="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Address</label>
            <input
              type="text"
              onChange={handleOnChange}
              defaultValue={user?.address || ""}
              name="address"
              placeholder="Enter your address"
            />
          </div>
          <div className="input-item">
            <label htmlFor="">Phone</label>
            <input
              type="text"
              onChange={handleOnChange}
              defaultValue={user?.phone || ""}
              name="phone"
              placeholder="Enter your phone"
            />
          </div>
        </form>
        <div className="summary">
          <div className="header">
            <strong>Order Summary</strong>
          </div>
          <div className="cart-list">
            {cartList?.map((item) => (
              <div key={item.cartItemId} className="cart-item">
                <div className="main">
                  <img src={item.product.image} alt="" />
                  <div>
                    <strong>{item.product.name}</strong>
                    <p>Size {item.size.name}</p>
                    <span>{formatPrice(item.product.price)}</span>
                  </div>
                </div>
                <p className="quantity">{item.quantity} items</p>
              </div>
            ))}
          </div>
          <div className="total">
            <div className="subtotal">
              <div className="item">
                <p>Subtotal</p>
                <strong>{formatPrice(totalTotalCartValue())}</strong>
              </div>
              <div className="item">
                <p>Shipping</p>
                <strong>Free</strong>
              </div>
            </div>
            <div className="confirm">
              <div>
                <strong>Total</strong>
                <strong>{formatPrice(totalTotalCartValue())}</strong>
              </div>
              <button onClick={handleCheckout}>
                Confirm Pay {formatPrice(totalTotalCartValue())}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
