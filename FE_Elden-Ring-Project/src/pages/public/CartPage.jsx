import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// import styles
import "../../styles/public/cart/cart.css";
// import components
import { Navbar } from "../../components/navbar/Navbar";
import { AdvanceNavbar } from "../../components/navbar/AdvanceNavbar";
import { Footer } from "../../components/footer/Footer";
// import service
import * as CartService from "../../service/cart/cart";
export const CartPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // state
  const [cartList, setCartList] = useState([]);
  const [isEmptyCart, setIsEmptyCart] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  // query
  const { data: cartInfo, isError } = useQuery({
    queryKey: ["my-cart"],
    queryFn: () => CartService.getMyCart(user?.userId),
  });
  // mutation
  const queryClient = useQueryClient();
  const removeMutation = useMutation({
    mutationKey: ["removeProduct"],
    mutationFn: CartService.removeItemFromCart,
    onSuccess: () => {
      toast.success("Item removed", {
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
      queryClient.invalidateQueries(["my-cart"]);
      queryClient.refetchQueries(["my-cart"]);
    },
  });
  const updateQuantityMutation = useMutation({
    mutationKey: ["updateQuantity"],
    mutationFn: ({ cartId, cartItemId, quantity }) =>
      CartService.updateQuantityItem(cartId, cartItemId, quantity),
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
        toast.success("Quantity updated", {
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
        queryClient.invalidateQueries(["my-cart"]);
        queryClient.refetchQueries(["my-cart"]);
      }
    },
  });
  // handle func
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
  const handleRemoveItemFromCart = async (cartItemId) => {
    console.log(cartItemId);
    try {
      await removeMutation.mutateAsync(cartItemId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateQuantity = debounce(
    async (cartItemId, currentQuantity, change) => {
      const newQuantity = currentQuantity + change;
      if (newQuantity < 1) return;

      try {
        await updateQuantityMutation.mutateAsync({
          cartId: cartInfo.cartId,
          cartItemId,
          quantity: newQuantity,
        });
      } catch (error) {
        console.log(error);
      }
    },
    200
  );
  useEffect(() => {
    if (cartInfo) {
      setCartList(cartInfo.cartItems);
    }
    if (isError) {
      setIsServerError(true);
    } else {
      setIsServerError(false);
    }
    if (cartList?.length === 0) {
      setIsEmptyCart(true);
    } else {
      setIsEmptyCart(false);
    }
  }, [cartInfo, cartList, isError]);
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);

  const calculateTotalItemPrice = (price, quantity) => {
    return price * quantity;
  };
  const totalTotalCartValue = () => {
    return Array.isArray(cartList)
      ? cartList.reduce((total, item) => {
          return total + (item.quantity || 0) * (item.product.price || 0);
        }, 0)
      : 0;
  };
  const totalQuantity = () => {
    return Array.isArray(cartList)
      ? cartList.reduce((total, item) => {
          return total + (item.quantity || 0);
        }, 0)
      : 0;
  };
  return (
    <div className="cart-container">
      <ToastContainer />
      <Navbar />
      <AdvanceNavbar />
      <div className="cart">
        {isServerError ? (
          <>
            <div className="server-error">
              <p>Server is error now, please press F5 to reload again.</p>
            </div>
          </>
        ) : isEmptyCart ? (
          <>
            <div className="empty-list">
              <p>Your cart is empty, please add some items</p>
            </div>
          </>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartList?.map((item) => (
                  <tr key={item.cartItemId}>
                    <td>
                      <img src={item.product.image} alt="" />
                      <div>
                        <p>{item.cateName} Category</p>
                        <strong>{item.product.name}</strong>
                        <span>Size {item.size.name}</span>
                      </div>
                    </td>
                    <td>{formatPrice(item.product.price)}</td>
                    <td>
                      <p
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartItemId,
                            item.quantity,
                            -1
                          )
                        }
                      >
                        -
                      </p>
                      <p>{item.quantity}</p>
                      <p
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartItemId,
                            item.quantity,
                            1
                          )
                        }
                      >
                        +
                      </p>
                    </td>
                    <td>
                      {formatPrice(
                        calculateTotalItemPrice(
                          item.product.price,
                          item.quantity
                        )
                      )}
                    </td>
                    <td>
                      <i
                        className="bx bxs-trash-alt"
                        onClick={() =>
                          handleRemoveItemFromCart(item.cartItemId)
                        }
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="checkout">
              <div className="header">
                <strong>Cart Summary</strong>
              </div>
              <div className="main">
                <div className="item">
                  <p>Total items</p>
                  <strong>{totalQuantity()} items</strong>
                </div>
                <div className="item">
                  <p>Cart Subtotal</p>
                  <strong>{formatPrice(totalTotalCartValue())}</strong>
                </div>
                <div className="item">
                  <p>Shipping</p>
                  <strong>Free</strong>
                </div>
                <div className="total">
                  <strong>Cart Total</strong>
                  <strong>{formatPrice(totalTotalCartValue())}</strong>
                </div>
              </div>
              <Link to="/checkout">Go to checkout</Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};
