import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import {
  toggleAnimateOrderModalOff,
  togglePreviewOrderModalOff,
} from "../../redux/slices/modal/modal";
// import service
import * as PaymentService from "../../service/payment/payment";
export const OrderDetail = () => {
  // selector
  const isToggleOrderDetailModal = useSelector(
    (state) => state.modal.previewOrderModal.isToggleModal
  );
  const isToggleAnimateOrderDetailModal = useSelector(
    (state) => state.modal.animateOrderModal.isToggleModal
  );
  const orderInfo = useSelector((state) => state.order.orderInfo.orderInfo);
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);
  // mutation
  const rejectMutation = useMutation({
    mutationKey: ["reject-order"],
    mutationFn: PaymentService.rejectOrder,
    onMutate: () => {
      setIsLoadingMutation(true);
    },
    onSuccess: () => {
      toast.success("Reject order successful", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        setIsLoadingMutation(false);
        location.reload();
      }, 1500);
    },
  });
  const approveMutation = useMutation({
    mutationKey: ["reject-order"],
    mutationFn: PaymentService.approveOrder,
    onMutate: () => {
      setIsLoadingMutation(true);
    },
    onSuccess: () => {
      toast.success("Approve order successful", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        setIsLoadingMutation(false);
        location.reload();
      }, 1500);
    },
  });
  //   handle func
  const handleToggleDetailOrderModalOff = () => {
    dispatch(toggleAnimateOrderModalOff());
    setTimeout(() => {
      dispatch(togglePreviewOrderModalOff());
    }, 800);
  };
  const handleRejectOrder = async () => {
    try {
      await rejectMutation.mutateAsync(orderInfo?.order?.orderId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleApproveOrder = async () => {
    try {
      await approveMutation.mutateAsync(orderInfo?.order?.orderId);
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  const formatTime = (dateString) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleTimeString("en-GB", options);
  };
  const calculateTotalItemPrice = (price, quantity) => {
    return price * quantity;
  };
  const totalOrderValue = () => {
    return orderInfo?.order?.orderDetails?.reduce((total, item) => {
      return total + calculateTotalItemPrice(item.unitPrice, item.quantity);
    }, 0);
  };
  return (
    <div
      className={
        isToggleOrderDetailModal
          ? `detail-order-container`
          : `detail-order-close`
      }
    >
      <ToastContainer />
      <div
        className={
          isToggleAnimateOrderDetailModal
            ? `detail-order-modal open`
            : `detail-order-modal close`
        }
      >
        <div className="header">
          <strong>{orderInfo?.order?.fullname}'s Invoice</strong>
          <i className="bx bx-x" onClick={handleToggleDetailOrderModalOff}></i>
        </div>
        {orderInfo?.order?.status === "PENDING" && (
          <div className="pending">
            <i className="bx bx-loader"></i>
            <p>
              Invoice is wating for confirmation, {orderInfo?.order?.fullname}{" "}
              had paid on {formatDate(orderInfo?.order?.createdDate)}
            </p>
          </div>
        )}
        {orderInfo?.order?.status === "APPROVED" && (
          <div className="approved">
            <i className="bx bx-check"></i>
            <p>
              You have approved this invoice, please prepare for the delivery.
            </p>
          </div>
        )}
        {orderInfo?.order?.status === "REJECTED" && (
          <div className="rejected">
            <i className="bx bx-x"></i>
            <p>This order is cancelled, please prepare for the refund.</p>
          </div>
        )}
        {orderInfo?.order?.status === "REFUNDED" && (
          <div className="refunded">
            <i className="bx bx-sync"></i>
            <p>
              This order had been approved the refund request, please prepare
              for refund
            </p>
          </div>
        )}
        <div className="order-infomation">
          <div className="list">
            <div className="two-items">
              <div className="item">
                <p>Name</p>
                <strong>{orderInfo?.order?.fullname}</strong>
              </div>
              <div className="item">
                <p>Email</p>
                <strong>{orderInfo?.order?.email}</strong>
              </div>
            </div>
            <div className="two-items">
              <div className="item">
                <p>Address</p>
                <strong>{orderInfo?.order?.address}</strong>
              </div>
              <div className="item">
                <p>Phone</p>
                <strong>{orderInfo?.order?.phone}</strong>
              </div>
            </div>
          </div>
          <div className="list">
            <div className="two-items">
              <div className="item">
                <p>Date</p>
                <strong>{formatDate(orderInfo?.order?.createdDate)}</strong>
              </div>
              <div className="item">
                <p>Time</p>
                <strong>{formatTime(orderInfo?.order?.createdDate)}</strong>
              </div>
            </div>
            <div className="two-items">
              <div className="item">
                <p>Payment ID</p>
                <strong>{orderInfo?.order?.paymentId}</strong>
              </div>
              <div className="item">
                <p>Payment method</p>
                <strong>Paypal</strong>
              </div>
            </div>
          </div>
          <div className="order-cart">
            <label htmlFor="">Items</label>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Quantity</th>
                  <th>Total amount</th>
                </tr>
              </thead>
              <tbody>
                {orderInfo?.order?.orderDetails?.map((item) => (
                  <tr key={item.orderDetailId}>
                    <td>{item.productName}</td>
                    <td>{formatPrice(item.unitPrice)}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {formatPrice(
                        calculateTotalItemPrice(item.unitPrice, item.quantity)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <div className="total">
                <strong>Total</strong>
                <strong>{formatPrice(totalOrderValue())}</strong>
              </div>
            </table>
          </div>
        </div>
        <div className="buttons">
          {orderInfo?.order?.status === "PENDING" && (
            <>
              <button onClick={handleApproveOrder} disabled={isLoadingMutation}>
                <i className="bx bx-check"></i>
                <p>Mark as Success</p>
              </button>
              <button onClick={handleRejectOrder} disabled={isLoadingMutation}>
                <i className="bx bx-x"></i>
                <p>Mark as Reject</p>
              </button>
            </>
          )}
          {orderInfo?.order?.status === "APPROVED" && (
            <>
              <button disabled className="marked-success">
                <i className="bx bx-check"></i>
                <p>marked as Approved</p>
              </button>
              <button disabled className="marked-success">
                <i className="bx bx-x"></i>
                <p>You have marked as Approved</p>
              </button>
            </>
          )}
          {orderInfo?.order?.status === "REJECTED" && (
            <>
              <button disabled className="marked-reject">
                <i className="bx bx-check"></i>
                <p>You have marked as Reject</p>
              </button>
              <button disabled className="marked-reject">
                <i className="bx bx-x"></i>
                <p>Marked as Reject</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
