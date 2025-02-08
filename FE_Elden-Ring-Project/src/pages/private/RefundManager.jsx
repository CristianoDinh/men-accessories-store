import React from "react";
// import styles
import "../../styles/private/refund/refund.css";
// import components
import { Dashnav } from "../../components/navbar/Dashnav";
import { RefundList } from "../../components/private/refund/RefundList";
import { RefundDetail } from "../../components/modal/RefundDetail";
export const RefundManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="refund-manager-container">
      <RefundDetail />
      <Dashnav />
      <div className="refund-manager">
        <div className="header">
          <p>Refund Manager</p>
          <div className="my-info">
            <i className="bx bx-user-circle"></i>
            <div>
              <strong>Hi, {user.fullName}</strong>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
        <RefundList />
      </div>
    </div>
  );
};
