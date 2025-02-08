import React from "react";
// import styles
import "../../styles/private/order/order.css";
// import components
import { Dashnav } from "../../components/navbar/Dashnav";
import { OrderList } from "../../components/private/order/OrderList";
import { OrderDetail } from "../../components/modal/OrderDetail";
export const OrderManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="order-manager-container">
      <OrderDetail />
      <Dashnav />
      <div className="order-manager">
        <div className="header">
          <p>Order Manager</p>
          <div className="my-info">
            <i className="bx bx-user-circle"></i>
            <div>
              <strong>Hi, {user.fullName}</strong>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
        <OrderList />
      </div>
    </div>
  );
};
