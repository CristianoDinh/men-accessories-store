import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../../styles/components/public/my-order/my-order.css";
// import slices
import {
  toggleAnimateMyOrderModalOn,
  togglePreviewMyOrderModalOn,
} from "../../../redux/slices/modal/modal";
import { setOrderInfo } from "../../../redux/slices/order/order";
// import service
import * as OrderService from "../../../service/order/order";
import { ClipLoader } from "react-spinners";
export const MyOrderList = () => {
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  // query
  const {
    data: orderList = [],
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["my-order"],
    queryFn: OrderService.getMyOrder,
  });
  // handle func
  const handleToggleMyOrderDetailModalOn = (orderInfo) => {
    dispatch(setOrderInfo(orderInfo));
    dispatch(togglePreviewMyOrderModalOn());
    setTimeout(() => {
      dispatch(toggleAnimateMyOrderModalOn());
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

  return (
    <div className="customer-order-list">
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
          {orderList?.map((order) => (
            <div
              key={order.order.orderId}
              className="order-item"
              onClick={() => handleToggleMyOrderDetailModalOn(order)}
            >
              <div className="item1">
                <div className="time">
                  <i className="bx bx-time"></i>
                  <div>
                    {order.order.status === "PENDING" && (
                      <p className="pending">Pending</p>
                    )}
                    {order.order.status === "APPROVED" && (
                      <p className="success">Approved</p>
                    )}
                    {order.order.status === "REJECTED" && (
                      <p className="reject">Rejected</p>
                    )}
                    {order.order.status === "REFUNDED" && (
                      <p className="refund">Refunded</p>
                    )}
                    <strong>{formatDate(order.order.createdDate)}</strong>
                  </div>
                </div>
                <i className="bx bx-chevron-right"></i>
              </div>
              <div className="item2">
                <div className="item">
                  <i className="bx bxl-paypal"></i>
                  <div>
                    <p>Payment ID</p>
                    <strong>{order.order.paymentId}</strong>
                  </div>
                </div>
                <div className="item">
                  <i className="bx bx-dollar-circle"></i>
                  <div>
                    <p>Invoice Amount</p>
                    <strong>{formatPrice(order.order.total)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
