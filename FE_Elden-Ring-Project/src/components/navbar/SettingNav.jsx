import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// import styles
import "../../styles/components/navbar/navbar.css";
// import service
import * as AccountService from "../../service/account/account";
export const SettingNav = () => {
  const token = localStorage.getItem("token");
  // navigate
  const navigate = useNavigate();
  // mutation
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: AccountService.logoutService,
    onSuccess: () => {
      navigate("/login");
    },
  });
  // handle func
  const handleLogout = async () => {
    try {
      await mutation.mutateAsync(token);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="setting-nav-container">
      <div className="setting-nav">
        <h2>My Setting</h2>
        <div className="list">
          <NavLink
            to="/setting/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bx-user"></i>
            <p>Personal Info</p>
          </NavLink>
          <NavLink
            to="/setting/security"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bx-check-shield"></i>
            <p>Password & Security</p>
          </NavLink>
          <NavLink
            to="/setting/my-order"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bx-shopping-bag"></i>
            <p>My Orders</p>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bx-arrow-back bx-flip-vertical"></i>
            <p>Return to homepage</p>
          </NavLink>
          <NavLink
            onClick={handleLogout}
            className={({ isActive }) => (isActive ? "" : "")}
          >
            <i className="bx bx-log-out-circle"></i>
            <p>Logout</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
