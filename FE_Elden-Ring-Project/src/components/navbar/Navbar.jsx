import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import "../../styles/components/navbar/navbar.css";
// import slices
import {
  toggleNavbarOn,
  toggleAnimateNavbarOn,
} from "../../redux/slices/navbar/navbar";
// import service
import * as CartService from "../../service/cart/cart";

export const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  // state
  const [cartList, setCartList] = useState([]);
  // query
  const { data: cartInfo = {} } = useQuery({
    queryKey: ["my-cart"],
    queryFn: () => CartService.getMyCart(userId),
  });
  // handle func
  useEffect(() => {
    if (cartInfo) {
      setCartList(cartInfo.cartItems || []);
    }
  }, [cartInfo]);
  const handleToggleAdvanceNavbar = () => {
    dispatch(toggleNavbarOn());
    setTimeout(() => {
      dispatch(toggleAnimateNavbarOn());
    }, 1);
  };
  const totalQuantity = () => {
    return Array.isArray(cartList)
      ? cartList.reduce((total, item) => {
          return total + (item.quantity || 0);
        }, 0)
      : 0;
  };
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="main">
          <i className="bx bx-menu" onClick={handleToggleAdvanceNavbar}></i>
          <NavLink
            to="/shop"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Shop
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About Us
          </NavLink>
        </div>
        <Link to="/" className="logo">
          <strong>EldenRing</strong>
        </Link>
        {user && token ? (
          <div className="my-profile">
            {user.role !== "ADMIN" &&
              (cartList?.length > 0 ? (
                <>
                  <Link
                    state={{ cartInfo: cartInfo }}
                    className="cart-quantity"
                    to="/cart"
                  >
                    <i className="bx bxs-cart"></i>
                    <p className="quantity">{totalQuantity()}</p>
                  </Link>
                </>
              ) : (
                <>
                  <Link state={{ cartInfo: cartInfo }} to="/cart">
                    <i className="bx bx-cart"></i>
                  </Link>
                </>
              ))}

            <Link to="/setting/profile">
              <div className="info">
                <i className="bx bx-user"></i>
                <div>
                  <strong>{user.fullName}</strong>
                  <p>{user.email}</p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="auth">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </div>
  );
};
