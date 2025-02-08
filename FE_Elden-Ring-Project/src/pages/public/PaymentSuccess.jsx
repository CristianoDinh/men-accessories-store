import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// import styles
import "../../styles/public/paymentsuccess/paymentsuccess.css";
// import service
import * as OrderService from "../../service/order/order";
export const PaymentSuccess = () => {
  const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get("paymentId");
  // navigate
  const navigate = useNavigate();
  // state
  const [submitData, setSubmitData] = useState({
    fullname: paymentInfo.fullName || "",
    email: paymentInfo.email || "",
    phone: paymentInfo.phone || "",
    address: paymentInfo.address || "",
    cartId: paymentInfo.cartId || "",
    total: paymentInfo.total || "",
    paymentId,
  });

  // mutation
  const mutation = useMutation({
    mutationKey: ["create-order"],
    mutationFn: OrderService.createOrderCheckout,
  });
  // handle func
  const handleCreateOrder = async () => {
    try {
      await mutation.mutateAsync(submitData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleReturn = () => {
    localStorage.removeItem("paymentInfo");
  };
  useEffect(() => {
    if (!paymentInfo) {
      navigate("/");
    }
    handleCreateOrder();
  }, []);
  return (
    <div className="payment-success-container">
      <div className="payment-success">
        <i className="bx bxs-check-circle"></i>
        <strong>Payment Successful!</strong>
        <p>
          Eldenring would like to thank you for purchasing from us, your order
          is currently awaiting approval for shipping. To check your invoice,
          please check My Orders section
        </p>
        <Link to="/" onClick={handleReturn}>
          Return to homepage
        </Link>
      </div>
    </div>
  );
};
