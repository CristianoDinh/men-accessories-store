import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../../styles/components/private/order/order.css";
// import slices
import {
  toggleAnimateOrderModalOn,
  togglePreviewOrderModalOn,
} from "../../../redux/slices/modal/modal";
import { setOrderInfo } from "../../../redux/slices/order/order";
// import service
import * as OrderService from "../../../service/order/order";
import { ClipLoader } from "react-spinners";
export const OrderList = () => {
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isServerError, setIsServerError] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(false);
  // query
  const {
    data: orderList = [],
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["allOrders"],
    queryFn: OrderService.getAllOrder,
  });
  // handle func
  const handleToggleOrderDetailModalOn = (orderInfo) => {
    dispatch(setOrderInfo(orderInfo));
    dispatch(togglePreviewOrderModalOn());
    setTimeout(() => {
      dispatch(toggleAnimateOrderModalOn());
    }, 1);
  };
  useEffect(() => {
    if (isLoading || isFetching) {
      setIsLoadingPage(true);
    } else {
      setIsLoadingPage(false);
    }
    if (isError) {
      setIsServerError(true);
    } else {
      setIsServerError(false);
    }
    if (orderList?.length === 0) {
      setIsEmptyList(true);
    } else {
      setIsEmptyList(false);
    }
  }, [isLoading, isFetching, isError]);
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  const totalOrderListAmount = () => {
    return orderList?.reduce((total, item) => {
      return total + item.order.total;
    }, 0);
  };
  const countPendingOrders = () => {
    return orderList.filter((order) => order?.order?.status === "PENDING")
      .length;
  };
  return (
    <div className="order-list-container">
      {isLoadingPage ? (
        <>
          <div className="loading">
            <ClipLoader color="#000000" size={40} />
          </div>
        </>
      ) : isServerError ? (
        <>
          <div className="server-error">
            <p>Server is error now, please press F5 to reload again.</p>
          </div>
        </>
      ) : isEmptyList ? (
        <>
          <div className="empty-list">
            <p>Your order list is empty</p>
          </div>
        </>
      ) : (
        <>
          <div className="utils">
            <div className="item-container">
              <div className="item">
                <div>
                  <p>Total invoice amount</p>
                  <i className="bx bx-dollar"></i>
                </div>
                <strong>{formatPrice(totalOrderListAmount())}</strong>
                <small>from {orderList?.length} invoices</small>
              </div>
            </div>
            <div className="item-container">
              <div className="item">
                <div>
                  <p>Pending invoices</p>
                  <i className="bx bx-calendar-x"></i>
                </div>
                <strong>{countPendingOrders()} Invoices</strong>
                <small>wating for confirm</small>
              </div>
            </div>
          </div>
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Invoice Amount</th>
                <th>Create Date</th>
                <th>Payment method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderList?.map((order) => (
                <tr key={order?.order?.orderId}>
                  <td>{order?.order?.orderId}</td>
                  <td>
                    <div>
                      <strong>{order?.order?.fullname}</strong>
                      <p>{order?.order?.email}</p>
                    </div>
                  </td>
                  <td>{formatPrice(order?.order?.total)}</td>
                  <td>{formatDate(order?.order?.createdDate)}</td>
                  <td>Paypal</td>
                  {order?.order?.status === "PENDING" && (
                    <td className="pending">
                      <i className="bx bxs-circle"></i>
                      <p>{order?.order?.status}</p>
                    </td>
                  )}
                  {order?.order?.status === "APPROVED" && (
                    <td className="approved">
                      <i className="bx bxs-circle"></i>
                      <p>{order?.order?.status}</p>
                    </td>
                  )}
                  {order?.order?.status === "REJECTED" && (
                    <td className="rejected">
                      <i className="bx bxs-circle"></i>
                      <p>{order?.order?.status}</p>
                    </td>
                  )}
                  {order?.order?.status === "REFUNDED" && (
                    <td className="refunded">
                      <i className="bx bxs-circle"></i>
                      <p>{order?.order?.status}</p>
                    </td>
                  )}
                  <td>
                    <i
                      className="bx bx-info-circle"
                      onClick={() => handleToggleOrderDetailModalOn(order)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
