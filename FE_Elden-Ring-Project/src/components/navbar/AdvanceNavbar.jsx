import React, { useCallback, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/components/navbar/navbar.css";
import {
  toggleNavbarOff,
  toggleAnimateNavbarOff,
} from "../../redux/slices/navbar/navbar";

export const AdvanceNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userRole = user?.role;

  const dispatch = useDispatch();

  // Selectors
  const isToggleAdvanceNavbar = useSelector(
    (state) => state.navbar.navbar.isToggleNavbar
  );
  const isToggleAnimateAdvanceNavbar = useSelector(
    (state) => state.navbar.animateNavbar.isToggleNavbar
  );

  // Ref to detect clicks outside
  const navbarRef = useRef(null);

  // Memoized function to handle navbar toggle
  const handleToggleAdvanceNavbar = useCallback(() => {
    dispatch(toggleAnimateNavbarOff());
    setTimeout(() => {
      dispatch(toggleNavbarOff());
    }, 800);
  }, [dispatch]);

  // Close navbar when clicking outside
  useEffect(() => {
    if (isToggleAdvanceNavbar) {
      const handleClickOutside = (event) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target)) {
          handleToggleAdvanceNavbar();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isToggleAdvanceNavbar, handleToggleAdvanceNavbar]);

  return (
    <div
      className={
        isToggleAdvanceNavbar
          ? `advance-navbar-container`
          : `advance-navbar-close`
      }
    >
      <div
        ref={navbarRef}
        className={
          isToggleAnimateAdvanceNavbar
            ? `advance-navbar open`
            : `advance-navbar close`
        }
      >
        <i className="bx bxs-up-arrow" onClick={handleToggleAdvanceNavbar}></i>
        <div className="menu-list">
          <div className="list">
            <div className="list-header">
              <span>Our Collections</span>
            </div>
            <div className="links">
              <NavLink
                to="/shop/category/3"
                onClick={handleToggleAdvanceNavbar}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Watches
              </NavLink>
              <NavLink
                to="/shop/category/2"
                onClick={handleToggleAdvanceNavbar}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Ring
              </NavLink>
              <NavLink
                to="/shop/category/1"
                onClick={handleToggleAdvanceNavbar}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Bags
              </NavLink>
              <NavLink
                to="/shop/category/4"
                onClick={handleToggleAdvanceNavbar}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Necklace
              </NavLink>
            </div>
          </div>
          <div className="list">
            <div className="list-header">
              <span>Introduction</span>
            </div>
            <div className="links">
              <NavLink
                to="/blogs"
                onClick={handleToggleAdvanceNavbar}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Blogs
              </NavLink>
              <NavLink
                to="/about"
                onClick={handleToggleAdvanceNavbar}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About EldenRing
              </NavLink>
            </div>
          </div>
          {user && token ? (
            <>
              <div className="list">
                <div className="list-header">
                  <span>Utilities</span>
                </div>
                <div className="links">
                  <NavLink
                    to="/setting/profile"
                    onClick={handleToggleAdvanceNavbar}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/setting/security"
                    onClick={handleToggleAdvanceNavbar}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Security
                  </NavLink>
                  <NavLink
                    to="/setting/my-order"
                    onClick={handleToggleAdvanceNavbar}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    My Orders
                  </NavLink>
                </div>
              </div>
              {userRole === "ADMIN" && (
                <div className="list">
                  <div className="list-header">
                    <span>Dashboard (for Manager)</span>
                  </div>
                  <div className="links">
                    <NavLink
                      to="/dashboard/blogs"
                      onClick={handleToggleAdvanceNavbar}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Blog Manager
                    </NavLink>
                    <NavLink
                      to="/dashboard/order"
                      onClick={handleToggleAdvanceNavbar}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Order Manager
                    </NavLink>
                    <NavLink
                      to="/dashboard/product"
                      onClick={handleToggleAdvanceNavbar}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Product Manager
                    </NavLink>
                    <NavLink
                      to="/dashboard/account"
                      onClick={handleToggleAdvanceNavbar}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Account Manager
                    </NavLink>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
